import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Table, Venue } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { QRCodeCanvas } from 'qrcode.react';
import * as QRCode from 'qrcode';
import { 
  Plus, 
  Trash2, 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink,
  Utensils,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SHOW_ORDIO_BRANDING = true;
const CANVAS_FONT = 'Inter, Arial, sans-serif';

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const drawForkAndKnife = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
  ctx.save();
  ctx.strokeStyle = '#FF6B35';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(cx - 26, cy - 34);
  ctx.lineTo(cx - 26, cy - 6);
  ctx.moveTo(cx - 14, cy - 34);
  ctx.lineTo(cx - 14, cy - 6);
  ctx.moveTo(cx - 2, cy - 34);
  ctx.lineTo(cx - 2, cy - 6);
  ctx.quadraticCurveTo(cx - 14, cy + 6, cx - 14, cy - 6);
  ctx.moveTo(cx - 14, cy - 2);
  ctx.lineTo(cx - 14, cy + 34);

  ctx.moveTo(cx + 18, cy - 34);
  ctx.quadraticCurveTo(cx + 32, cy - 14, cx + 18, cy + 4);
  ctx.lineTo(cx + 18, cy + 34);
  ctx.stroke();
  ctx.restore();
};

const drawSpacedText = (ctx: CanvasRenderingContext2D, text: string, centerX: number, y: number, spacing: number) => {
  const chars = text.split('');
  const widths = chars.map(char => ctx.measureText(char).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + spacing * (chars.length - 1);
  let x = centerX - totalWidth / 2;

  ctx.textAlign = 'center';
  chars.forEach((char, index) => {
    ctx.fillText(char, x + widths[index] / 2, y);
    x += widths[index] + spacing;
  });
};

export default function AdminTables() {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Table state
  const [newTableNum, setNewTableNum] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!user?.venueId) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: vData } = await supabase.from('venues').select('*').eq('id', user.venueId).single();
      if (vData) setVenue({ id: vData.id, name: vData.name, description: vData.description, logoUrl: vData.logo_url });

      const { data: tData } = await supabase
        .from('tables')
        .select('*')
        .eq('venue_id', user.venueId)
        .order('table_number');
      
      if (tData) {
        const mapped: Table[] = tData.map((t: any) => ({
          id: t.id,
          venueId: t.venue_id,
          tableNumber: t.table_number
        }));
        setTables(mapped);
        if (mapped.length > 0 && !selectedTableId) setSelectedTableId(mapped[0].id);
      }
      setLoading(false);
    };

    fetchData();
  }, [user?.venueId]);

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Generate target URL for QR code
  const targetUrl = useMemo(() => {
    if (!selectedTable || !user?.venueId) return '';
    return `${window.location.origin}/menu/${user.venueId}/${selectedTable.id}`;
  }, [selectedTable, user?.venueId]);

  // Handle Add Table submission
  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum.trim() || !user?.venueId) return;

    const exists = tables.some(
      t => t.tableNumber.toLowerCase() === `table ${newTableNum.trim()}`.toLowerCase() || 
           t.tableNumber.toLowerCase() === newTableNum.trim().toLowerCase()
    );

    if (exists) {
      alert('This table number already exists in your workspace.');
      return;
    }

    const tableNumberDisplay = newTableNum.toLowerCase().startsWith('table') 
      ? newTableNum.trim() 
      : `Table ${newTableNum.trim()}`;

    const { data, error } = await supabase.from('tables').insert({
      venue_id: user.venueId,
      table_number: tableNumberDisplay
    }).select().single();

    if (error) return alert('Failed to register table');

    const newTable: Table = {
      id: data.id,
      venueId: data.venue_id,
      tableNumber: data.table_number
    };

    setTables(prev => [...prev, newTable].sort((a,b) => a.tableNumber.localeCompare(b.tableNumber)));
    setSelectedTableId(data.id);
    setNewTableNum('');
    setCreateSuccess(true);
    setTimeout(() => setCreateSuccess(false), 1500);
  };

  const deleteTable = async (tableId: string) => {
    if (!confirm('Remove this table?')) return;
    const { error } = await supabase.from('tables').delete().eq('id', tableId);
    if (error) return alert('Delete failed');

    const remaining = tables.filter(t => t.id !== tableId);
    setTables(remaining);
    if (selectedTableId === tableId && remaining.length > 0) {
      setSelectedTableId(remaining[0].id);
    }
  };

  const copyUrlToClipboard = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const downloadAsPng = async () => {
    if (!selectedTable || !targetUrl) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: 'H',
        margin: 0,
        width: 640,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      });

      const [logoImg, qrImg] = await Promise.all([
        venue?.logoUrl ? loadImage(venue.logoUrl) : Promise.resolve(null),
        loadImage(qrDataUrl),
      ]);

      ctx.fillStyle = '#FFF8F3';
      ctx.fillRect(0, 0, 1200, 1800);

      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1200, 0);
      ctx.lineTo(1200, 260);
      ctx.quadraticCurveTo(1200, 320, 1140, 320);
      ctx.lineTo(60, 320);
      ctx.quadraticCurveTo(0, 320, 0, 260);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(600, 95, 70, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      if (logoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(600, 95, 62, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, 538, 33, 124, 124);
        ctx.restore();
      } else {
        drawForkAndKnife(ctx, 600, 95);
      }

      ctx.beginPath();
      ctx.arc(600, 95, 70, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.stroke();

      const venueName = venue?.name || 'Our Venue';
      let nameSize = 64;
      ctx.font = `700 ${nameSize}px ${CANVAS_FONT}`;
      while (ctx.measureText(venueName).width > 1000 && nameSize > 28) {
        nameSize -= 2;
        ctx.font = `700 ${nameSize}px ${CANVAS_FONT}`;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(venueName, 600, 235);

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.14)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;
      roundRect(ctx, 220, 270, 760, 760, 48);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.restore();

      if (qrImg) {
        ctx.drawImage(qrImg, 280, 330, 640, 640);
      }

      ctx.font = `700 36px ${CANVAS_FONT}`;
      ctx.fillStyle = '#FF6B35';
      drawSpacedText(ctx, 'MEJA', 600, 1110, 12);

      const tableNumber = selectedTable.tableNumber.replace(/^Table\s+/i, '');
      let tableSize = 200;
      ctx.font = `900 ${tableSize}px ${CANVAS_FONT}`;
      while (ctx.measureText(tableNumber).width > 1050 && tableSize > 80) {
        tableSize -= 4;
        ctx.font = `900 ${tableSize}px ${CANVAS_FONT}`;
      }
      ctx.fillStyle = '#0F172A';
      ctx.fillText(tableNumber, 600, 1340);

      const pillText = 'Scan untuk Pesan';
      ctx.font = `700 56px ${CANVAS_FONT}`;
      const pillWidth = ctx.measureText(pillText).width + 120;
      const pillHeight = 100;
      const pillY = 1425;
      roundRect(ctx, 600 - pillWidth / 2, pillY, pillWidth, pillHeight, pillHeight / 2);
      ctx.fillStyle = '#FF6B35';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.fillText(pillText, 600, pillY + pillHeight / 2 + 2);
      ctx.textBaseline = 'alphabetic';

      const steps = ['Scan QR', 'Pilih Menu', 'Bayar di Kasir'];
      ctx.font = `600 34px ${CANVAS_FONT}`;
      const stepLabelWidths = steps.map(step => ctx.measureText(step).width);
      const circleRadius = 20;
      const circleGap = 12;
      const stepGap = 56;
      const stepsWidth = stepLabelWidths.reduce((sum, width) => sum + width, 0)
        + steps.length * (circleRadius * 2 + circleGap)
        + (steps.length - 1) * stepGap;
      let stepX = (1200 - stepsWidth) / 2;
      const stepY = 1575;

      steps.forEach((step, index) => {
        ctx.beginPath();
        ctx.arc(stepX + circleRadius, stepY, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B35';
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `700 22px ${CANVAS_FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1), stepX + circleRadius, stepY + 1);

        ctx.fillStyle = '#64748B';
        ctx.font = `600 34px ${CANVAS_FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(step, stepX + circleRadius * 2 + circleGap + stepLabelWidths[index] / 2, stepY + 1);

        stepX += circleRadius * 2 + circleGap + stepLabelWidths[index] + stepGap;
      });

      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      const isWhiteLabel = Boolean((venue as Venue & { whiteLabel?: boolean })?.whiteLabel);
      if (SHOW_ORDIO_BRANDING && !isWhiteLabel) {
        ctx.font = `500 28px ${CANVAS_FONT}`;
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Powered by Ordio', 600, 1735);
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `Meja-${selectedTable.tableNumber}-${venue?.name || 'Venue'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate the PNG card.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout
      title="Meja & Generator QR"
      subtitle="Kelola meja makan dan buat kartu meja QR otomatis."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: Table roster & Provision form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* List existing ones */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Area Terdaftar</h3>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {tables.map(table => {
                const isSelected = table.id === selectedTableId;
                return (
                  <div
                    key={table.id}
                    id={`table-row-${table.id}`}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50/10 shadow-xs' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        T{table.tableNumber.replace(/\D/g, '') || table.tableNumber[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{table.tableNumber}</span>
                    </div>

                    <button
                      id={`delete-table-btn-${table.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTable(table.id);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Delete table entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {tables.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No tables configured. Use the form below to provision a dining desk.
                </div>
              )}
            </div>
          </div>

          {/* Create new table form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">Tambah Meja</h3>
            
            {createSuccess && (
              <div className="mb-3 bg-indigo-50 text-indigo-700 text-xs font-semibold p-2 rounded-lg border border-indigo-100">
                Meja dan kartu QR berhasil dibuat!
              </div>
            )}

            <form onSubmit={handleAddTable} className="space-y-3">
              <div>
                <label htmlFor="table-number-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor / Referensi Meja
                </label>
                <input
                  id="table-number-input"
                  type="text"
                  required
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                  placeholder="E.g., 6, Terrace A, VIP Booth"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                id="btn-add-table"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Daftarkan Meja</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right side: QR designer & Print Tent Leaflet */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div
                key={selectedTable.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                {/* Visual flyer designer */}
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Active QR Ticket
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">
                      Routing for {selectedTable.tableNumber}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 lines-clamp-3">
                      When guests scan this code on their personal smartphone, they are instantly redirected to your cafe menu page customized for this table.
                    </p>
                  </div>

                  {/* Generated String URL panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Redirect URI</span>
                    <div className="flex gap-2 items-center min-w-0">
                      <div className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md overflow-x-auto whitespace-nowrap flex-1 scrollbar-none">
                        {targetUrl}
                      </div>

                      <button
                        id="copy-url-btn"
                        onClick={copyUrlToClipboard}
                        className="bg-white border border-slate-200 hover:bg-slate-100 p-2 rounded-lg text-slate-600 transition-colors cursor-pointer flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-indigo-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <a
                        id="test-url-btn"
                        href={`/menu/${selectedTable.venueId}/${selectedTable.tableNumber.toLowerCase().replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-slate-200 hover:bg-slate-100 p-2 rounded-lg text-slate-600 transition-colors flex-shrink-0"
                        title="Test Client page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      id="btn-print-action"
                      onClick={handlePrint}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Kartu Meja</span>
                    </button>
                    <button
                      id="btn-download-action"
                      onClick={downloadAsPng}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh PNG</span>
                    </button>
                  </div>
                </div>

                {/* Print Flyer Artwork Design simulation / Desktop Table Tent view */}
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 relative overflow-hidden group">

                  {/* Outer Flyer leaf */}
                  <div
                    id="tent-card-preview"
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      aspectRatio: '2 / 3',
                      containerType: 'inline-size',
                      backgroundColor: '#FFF8F3',
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      fontFamily: 'Inter, Arial, sans-serif',
                      textAlign: 'center',
                      color: '#0F172A'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '26.667cqw', backgroundColor: '#FF6B35', borderBottomLeftRadius: '5cqw', borderBottomRightRadius: '5cqw' }} />

                    <div style={{ position: 'absolute', top: '2.083cqw', left: '50%', transform: 'translateX(-50%)', width: '11.667cqw', height: '11.667cqw', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '0.667cqw solid #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {venue?.logoUrl ? (
                        <img src={venue.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Utensils size={24} style={{ width: '55%', height: '55%', color: '#FF6B35' }} />
                      )}
                    </div>

                    <div style={{ position: 'absolute', top: '14.8cqw', left: '50%', transform: 'translateX(-50%)', width: '83.333cqw', color: '#FFFFFF', fontSize: (venue?.name?.length || 0) > 16 ? '4.2cqw' : '5.333cqw', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {venue?.name || 'Our Venue'}
                    </div>

                    <div style={{ position: 'absolute', top: '22.5cqw', left: '50%', transform: 'translateX(-50%)', width: '63.333cqw', height: '63.333cqw', borderRadius: '4cqw', backgroundColor: '#FFFFFF', boxShadow: '0 1.667cqw 3.333cqw -1.25cqw rgba(15, 23, 42, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {targetUrl ? (
                        <QRCodeCanvas
                          id="qr-canvas"
                          value={targetUrl}
                          size={640}
                          level="H"
                          includeMargin={false}
                          fgColor="#0F172A"
                          bgColor="#FFFFFF"
                          style={{ width: '53.333cqw', height: '53.333cqw' }}
                        />
                      ) : (
                        <QrCode size={48} style={{ width: '12cqw', height: '12cqw', color: '#CBD5E1' }} />
                      )}
                    </div>

                    <div style={{ position: 'absolute', top: '89.5cqw', left: 0, right: 0, fontSize: '3cqw', fontWeight: 700, letterSpacing: '0.18em', color: '#FF6B35' }}>MEJA</div>

                    <div style={{ position: 'absolute', top: '97.9cqw', left: 0, right: 0, fontSize: '16.667cqw', fontWeight: 900, lineHeight: 1, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 2cqw', boxSizing: 'border-box' }}>
                      {selectedTable.tableNumber.replace(/^Table\s+/i, '')}
                    </div>

                    <div style={{ position: 'absolute', top: '118.75cqw', left: '50%', transform: 'translateX(-50%)', height: '8.333cqw', padding: '0 5cqw', borderRadius: '99cqw', backgroundColor: '#FF6B35', color: '#FFFFFF', fontSize: '4.667cqw', fontWeight: 700, lineHeight: '8.333cqw', whiteSpace: 'nowrap' }}>
                      Scan untuk Pesan
                    </div>

                    <div style={{ position: 'absolute', top: '128.3cqw', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4.667cqw', fontSize: '2.833cqw', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
                      {['Scan QR', 'Pilih Menu', 'Bayar di Kasir'].map((step, index) => (
                        <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '1cqw' }}>
                          <span style={{ width: '3.333cqw', height: '3.333cqw', borderRadius: '50%', backgroundColor: '#FF6B35', color: '#FFFFFF', fontSize: '1.833cqw', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</span>
                          {step}
                        </span>
                      ))}
                    </div>

                    {SHOW_ORDIO_BRANDING && !(venue as Venue & { whiteLabel?: boolean })?.whiteLabel && (
                      <div style={{ position: 'absolute', top: '143cqw', left: 0, right: 0, fontSize: '2.333cqw', fontWeight: 500, color: '#94A3B8' }}>Powered by Ordio</div>
                    )}
                  </div>

                  <span className="absolute top-2.5 right-3 text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-3xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Print Tent Leaflet Preview
                  </span>

                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
                Select a table from the list to preview and export desktop-sign artwork.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </AdminLayout>
  );
}
