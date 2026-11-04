import type { ReactNode } from 'react';
import {
  QrCode,
  Plus,
  Printer,
  CheckCircle2,
  MessageCircle,
  UtensilsCrossed,
  Coffee,
  Search,
  Flame,
  BarChart3,
  Wallet,
  ArrowRight,
  Clock,
  Globe,
} from 'lucide-react';

const CREAM = '#FFF8F3';
const PAPER = '#FFFDFB';
const DARK = '#231A15';
const ORANGE = '#FF6B35';
const ORANGE_LIGHT = '#FFE3D6';
const ORANGE_SOFT = '#FFF0E8';
const MUTED = '#7A6A60';
const BORDER = '#EADCCF';
const GREEN = '#25D366';
const FONT = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";
const DEMO_URL = 'https://wa.me/6287855585366?text=Halo,%20saya%20tertarik%20dengan%20sistem%20QR%20order,%20boleh%20minta%20demo?';

const pageBase = {
  width: '210mm',
  height: '297mm',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  boxSizing: 'border-box' as const,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  fontFamily: FONT,
  color: DARK,
};

function OrdioLogo({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
      <div
        style={{
          width: 38 * scale,
          height: 38 * scale,
          borderRadius: 11 * scale,
          background: ORANGE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: `0 8px 18px ${ORANGE}33`,
        }}
      >
        <QrCode size={21 * scale} strokeWidth={2.4} />
      </div>
      <div>
        <div
          style={{
            fontSize: 22 * scale,
            fontWeight: 900,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            color: DARK,
          }}
        >
          Ordio
        </div>
      </div>
    </div>
  );
}

const QR_SIZE = 15;

function qrCellOn(r: number, c: number) {
  const finders = [
    [0, 0],
    [0, 10],
    [10, 0],
  ];
  for (const [fr, fc] of finders) {
    if (r >= fr && r < fr + 5 && c >= fc && c < fc + 5) {
      const rr = r - fr;
      const cc = c - fc;
      return rr === 0 || rr === 4 || cc === 0 || cc === 4 || (rr === 2 && cc === 2);
    }
  }
  return (r * 7 + c * 11 + r * c) % 5 < 2;
}

function QrGraphic({ size = 96 }: { size?: number }) {
  const cells = [];
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{ background: qrCellOn(r, c) ? DARK : 'transparent' }}
        />
      );
    }
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${QR_SIZE}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
}

function PageFooter({ page, bg = CREAM }: { page: string; bg?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${BORDER}`,
        paddingTop: 13,
        marginTop: 'auto',
        fontSize: 9.5,
        color: MUTED,
        letterSpacing: '0.02em',
        background: bg,
      }}
    >
      <span style={{ fontWeight: 600 }}>ordio.id &nbsp;·&nbsp; Solusi digital untuk bisnis kuliner</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 8.5, fontWeight: 600, color: MUTED }}>ordio.cc.cd</span>
        <span style={{ fontWeight: 800, color: ORANGE, letterSpacing: '0.12em' }}>{page}</span>
      </div>
    </div>
  );
}

function MiniPlus({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: ORANGE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        flexShrink: 0,
        boxShadow: `0 4px 10px ${ORANGE}55`,
      }}
    >
      <Plus size={size * 0.6} strokeWidth={3} />
    </div>
  );
}

function MenuRow({
  name,
  note,
  price,
  icon,
}: {
  name: string;
  note: string;
  price: string;
  icon: 'food' | 'coffee' | 'flame';
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: icon === 'coffee' ? '#F1E3D3' : '#FADDCB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: icon === 'coffee' ? '#8A5A3B' : ORANGE,
          flexShrink: 0,
        }}
      >
        {icon === 'food' && <UtensilsCrossed size={19} />}
        {icon === 'coffee' && <Coffee size={19} />}
        {icon === 'flame' && <Flame size={19} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: DARK, lineHeight: 1.2 }}>{name}</div>
        <div
          style={{
            fontSize: 8.5,
            color: MUTED,
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {note}
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: ORANGE, marginTop: 3 }}>{price}</div>
      </div>
      <MiniPlus size={23} />
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      style={{
        position: 'relative',
        width: 272,
        height: 566,
        borderRadius: 42,
        background: DARK,
        padding: 9,
        boxShadow: `0 30px 60px ${DARK}38, 0 2px 0 #FFFFFF33 inset`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 34,
          background: CREAM,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 76,
            height: 17,
            borderRadius: 999,
            background: DARK,
            zIndex: 3,
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '9px 20px 4px',
            fontSize: 9,
            fontWeight: 700,
            color: DARK,
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
              <div style={{ width: 2, height: 4, background: DARK, borderRadius: 1 }} />
              <div style={{ width: 2, height: 6, background: DARK, borderRadius: 1 }} />
              <div style={{ width: 2, height: 8, background: DARK, borderRadius: 1 }} />
            </div>
            <div
              style={{
                width: 15,
                height: 8,
                border: `1px solid ${DARK}`,
                borderRadius: 2,
                padding: 1,
                marginLeft: 2,
              }}
            >
              <div style={{ width: '70%', height: '100%', background: DARK, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em', color: DARK }}>
                Warung Nusantara
              </div>
              <div style={{ fontSize: 8.5, color: MUTED, marginTop: 3, fontWeight: 600 }}>
                Meja 04 &nbsp;·&nbsp; Dine In
              </div>
            </div>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                background: ORANGE_LIGHT,
                color: ORANGE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={14} />
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              height: 32,
              borderRadius: 10,
              background: '#F3E7DC',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 11px',
              color: MUTED,
              fontSize: 9.5,
            }}
          >
            <Search size={13} />
            <span>Cari menu favoritmu...</span>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 11 }}>
            {[
              { label: 'Semua', active: true },
              { label: 'Makanan', active: false },
              { label: 'Minuman', active: false },
            ].map((cat) => (
              <div
                key={cat.label}
                style={{
                  padding: '5px 11px',
                  borderRadius: 999,
                  fontSize: 8.5,
                  fontWeight: 800,
                  background: cat.active ? ORANGE : '#FFFFFF',
                  color: cat.active ? '#FFFFFF' : MUTED,
                  border: `1px solid ${cat.active ? ORANGE : BORDER}`,
                }}
              >
                {cat.label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflow: 'hidden',
          }}
        >
          <MenuRow name="Nasi Goreng" note="Nasi goreng kampung, telur, ayam" price="Rp 45.000" icon="food" />
          <MenuRow name="Ayam Bakar" note="Ayam bakar madu + sambal" price="Rp 55.000" icon="flame" />
          <MenuRow name="Es Kopi Susu" note="Kopi susu gula aren" price="Rp 22.000" icon="coffee" />
        </div>

        <div
          style={{
            padding: '10px 14px 14px',
            background: '#FFFFFF',
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: MUTED, fontWeight: 700 }}>3 item dipilih</div>
              <div style={{ fontSize: 13, color: DARK, fontWeight: 900, marginTop: 1 }}>Rp 122.000</div>
            </div>
            <div
              style={{
                background: ORANGE,
                color: '#FFFFFF',
                borderRadius: 10,
                padding: '9px 15px',
                fontSize: 9.5,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              Pesan Sekarang
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QrTentCard() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 34,
        width: 166,
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: '13px 13px 11px',
        transform: 'rotate(7deg)',
        boxShadow: `0 20px 40px ${DARK}24`,
        textAlign: 'center',
        zIndex: 2,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: '0.22em',
          color: ORANGE,
          marginBottom: 9,
        }}
      >
        ORDIO
      </div>
      <div
        style={{
          background: '#FFFFFF',
          padding: 6,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          display: 'inline-flex',
        }}
      >
        <QrGraphic size={88} />
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 900, color: DARK, marginTop: 9 }}>Scan untuk Pesan</div>
      <div
        style={{
          marginTop: 7,
          paddingTop: 6,
          borderTop: `1px dashed ${BORDER}`,
          fontSize: 8,
          fontWeight: 700,
          color: MUTED,
          letterSpacing: '0.06em',
        }}
      >
        MEJA 04
      </div>
    </div>
  );
}

function PageOne() {
  return (
    <section className="brochure-page" style={{ ...pageBase, background: CREAM, padding: '36px 46px 30px' }}>
      <div
        style={{
          position: 'absolute',
          top: -110,
          right: -90,
          width: 310,
          height: 310,
          borderRadius: '50%',
          background: '#FF6B3512',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: -130,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: '#FF6B350D',
        }}
      />

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <OrdioLogo />
        <div
          style={{
            padding: '7px 12px',
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: MUTED,
            background: '#FFFFFF99',
          }}
        >
          MENU QR &nbsp;·&nbsp; KASIR &nbsp;·&nbsp; DAPUR
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.08fr 0.92fr',
          gap: 18,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          paddingTop: 10,
        }}
      >
        <div style={{ paddingBottom: 26 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: ORANGE_LIGHT,
              borderRadius: 999,
              padding: '6px 11px',
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: ORANGE,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
            SISTEM PESANAN UNTUK BISNIS KULINER
          </div>

          <h1
            style={{
              fontSize: 38,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: '-0.045em',
              margin: 0,
              color: DARK,
            }}
          >
            Menu QR, Kasir
            <br />
            &amp; Dapur Dalam
            <br />
            <span style={{ color: ORANGE }}>Satu Sistem</span>
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.45,
              fontWeight: 600,
              color: '#5F4F45',
              margin: '20px 0 0',
              maxWidth: 340,
            }}
          >
            Terima pesanan lebih cepat, kurangi kesalahan order.
          </p>

          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: ORANGE,
              letterSpacing: '0.02em',
              marginTop: 10,
            }}
          >
            🌐 ordio.cc.cd
          </div>

          <p
            style={{
              fontSize: 10.5,
              lineHeight: 1.65,
              color: MUTED,
              margin: '12px 0 0',
              maxWidth: 340,
            }}
          >
            Pelanggan memesan langsung dari HP, kasir mengonfirmasi pembayaran, dan dapur menerima
            tiket secara real-time. Semua dalam satu dashboard.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 24, maxWidth: 350 }}>
            {['Tanpa install aplikasi', 'QR per meja', 'Pesanan real-time'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FFFFFF',
                  border: `1px solid ${BORDER}`,
                  borderRadius: 999,
                  padding: '6px 10px',
                  fontSize: 8.5,
                  fontWeight: 700,
                  color: DARK,
                }}
              >
                <CheckCircle2 size={11} color={ORANGE} strokeWidth={2.5} />
                {item}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 26 }}>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: ORANGE,
                color: '#FFFFFF',
                padding: '11px 19px',
                borderRadius: 11,
                fontSize: 10.5,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: `0 10px 22px ${ORANGE}40`,
              }}
            >
              Minta Demo
              <ArrowRight size={13} />
            </a>
            <div style={{ fontSize: 8.5, color: MUTED, fontWeight: 600, lineHeight: 1.4 }}>
              Demo langsung
              <br />
              sesuai kebutuhan
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: '100%',
            paddingBottom: 8,
          }}
        >
          <div style={{ marginRight: 44, marginTop: 4 }}>
            <PhoneMockup />
          </div>
          <QrTentCard />
        </div>
      </main>

      <PageFooter page="01 / 03" />
    </section>
  );
}

function CustomerScreen() {
  return (
    <div
      style={{
        width: 196,
        height: '100%',
        maxHeight: 296,
        borderRadius: 24,
        border: `6px solid ${DARK}`,
        background: CREAM,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 16px 30px ${DARK}26`,
      }}
    >
      <div style={{ padding: '10px 11px 7px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 900, color: DARK }}>Warung Nusantara</div>
            <div style={{ fontSize: 6.5, color: MUTED, fontWeight: 700, marginTop: 1 }}>Meja 04 · Dine In</div>
          </div>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              background: ORANGE_LIGHT,
              color: ORANGE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCode size={9} />
          </div>
        </div>
        <div
          style={{
            marginTop: 7,
            height: 19,
            borderRadius: 7,
            background: '#F3E7DC',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '0 7px',
            color: MUTED,
            fontSize: 6.5,
          }}
        >
          <Search size={8} />
          Cari menu...
        </div>
      </div>

      <div style={{ padding: '8px 11px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <MenuRow name="Nasi Goreng" note="Telur, ayam, kerupuk" price="Rp 45.000" icon="food" />
        <MenuRow name="Ayam Bakar" note="Madu & sambal" price="Rp 55.000" icon="flame" />
        <MenuRow name="Es Kopi Susu" note="Gula aren" price="Rp 22.000" icon="coffee" />
      </div>

      <div
        style={{
          background: '#FFFFFF',
          borderTop: `1px solid ${BORDER}`,
          padding: '7px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 5.5, color: MUTED, fontWeight: 700 }}>3 item</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: DARK }}>Rp 122.000</div>
        </div>
        <div
          style={{
            background: ORANGE,
            color: '#FFFFFF',
            borderRadius: 7,
            padding: '5px 8px',
            fontSize: 6.5,
            fontWeight: 800,
          }}
        >
          Pesan
        </div>
      </div>
    </div>
  );
}

function KasirScreen() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: 286,
        borderRadius: 12,
        border: `1px solid ${BORDER}`,
        background: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 16px 30px ${DARK}14`,
      }}
    >
      <div
        style={{
          height: 22,
          background: '#F7EFE8',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '0 9px',
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F87171' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FBBF24' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399' }} />
        <div
          style={{
            marginLeft: 8,
            fontSize: 5.8,
            color: MUTED,
            background: '#FFFFFF',
            borderRadius: 4,
            padding: '2px 16px',
            border: `1px solid ${BORDER}`,
          }}
        >
          app.ordio.id/kasir
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div
          style={{
            width: 46,
            background: DARK,
            padding: '9px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 21,
              height: 21,
              borderRadius: 6,
              background: ORANGE,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCode size={11} />
          </div>
          {[Wallet, UtensilsCrossed, BarChart3].map((Icon, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: i === 0 ? '#FFFFFF1A' : 'transparent',
                color: i === 0 ? ORANGE : '#9A8A80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={11} />
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: 10, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 900, color: DARK }}>Pesanan Masuk</div>
              <div style={{ fontSize: 6, color: MUTED, marginTop: 1 }}>Konfirmasi pembayaran</div>
            </div>
            <div
              style={{
                fontSize: 5.8,
                fontWeight: 800,
                color: ORANGE,
                background: ORANGE_LIGHT,
                borderRadius: 999,
                padding: '2px 6px',
              }}
            >
              3 BARU
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[
              { table: 'Meja 04', id: '#ORD-104', total: 'Rp 122.000', tag: 'Baru', tagBg: ORANGE_LIGHT, tagColor: ORANGE },
              { table: 'Meja 07', id: '#ORD-105', total: 'Rp 78.000', tag: 'Menunggu', tagBg: '#FEF3C7', tagColor: '#B45309' },
            ].map((order) => (
              <div
                key={order.id}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: 8,
                  background: '#FFFDFB',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 7.5, fontWeight: 900, color: DARK }}>
                    {order.table} <span style={{ color: MUTED, fontWeight: 600 }}>· {order.id}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 5.2,
                      fontWeight: 800,
                      color: order.tagColor,
                      background: order.tagBg,
                      padding: '1.5px 5px',
                      borderRadius: 999,
                    }}
                  >
                    {order.tag}
                  </div>
                </div>
                <div style={{ fontSize: 6, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>
                  Nasi Goreng x1 · Ayam Bakar x1 · Es Kopi Susu x1
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 8, fontWeight: 900, color: DARK }}>{order.total}</span>
                  <span
                    style={{
                      fontSize: 5.8,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      background: ORANGE,
                      borderRadius: 5,
                      padding: '3px 7px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <CheckCircle2 size={6} /> Konfirmasi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KitchenScreen() {
  const tickets = [
    { table: 'Meja 01', time: '2 mnt', status: 'BARU', color: '#FF6B35', bg: '#3A2118' },
    { table: 'Meja 04', time: '4 mnt', status: 'DIMASAK', color: '#FBBF24', bg: '#322612' },
    { table: 'Meja 07', time: '6 mnt', status: 'SIAP', color: '#34D399', bg: '#123126' },
  ];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: 286,
        borderRadius: 12,
        background: '#13100E',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #2A211C',
        boxShadow: `0 16px 30px ${DARK}40`,
      }}
    >
      <div
        style={{
          height: 28,
          borderBottom: '1px solid #2A211C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 11px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 17,
              height: 17,
              borderRadius: 5,
              background: ORANGE,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={9} />
          </div>
          <span style={{ fontSize: 8, fontWeight: 900, color: '#FFFFFF' }}>Kitchen Display</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#34D399' }} />
          <span style={{ fontSize: 5.5, color: '#9A8A80', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: 8, flex: 1, minHeight: 0 }}>
        {tickets.map((ticket, idx) => (
          <div
            key={ticket.table}
            style={{
              flex: 1,
              background: '#1D1814',
              border: '1px solid #2E241E',
              borderRadius: 8,
              padding: 7,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 6.8, fontWeight: 900, color: '#FFFFFF' }}>{ticket.table}</span>
              <span
                style={{
                  fontSize: 4.8,
                  fontWeight: 800,
                  color: ticket.color,
                  background: ticket.bg,
                  padding: '1.5px 4px',
                  borderRadius: 999,
                }}
              >
                {ticket.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#9A8A80', fontSize: 5.2 }}>
              <Clock size={5.5} />
              {ticket.time} lalu
            </div>
            <div style={{ height: 1, background: '#2E241E' }} />
            <div style={{ fontSize: 5.6, color: '#D6C7BD', lineHeight: 1.6 }}>
              {idx === 0 && (
                <>
                  <div>2x Nasi Goreng</div>
                  <div>1x Es Kopi Susu</div>
                </>
              )}
              {idx === 1 && (
                <>
                  <div>1x Ayam Bakar</div>
                  <div>2x Es Teh Manis</div>
                </>
              )}
              {idx === 2 && (
                <>
                  <div>1x Nasi Goreng</div>
                  <div>1x Es Kopi Susu</div>
                </>
              )}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 4 }}>
              <div
                style={{
                  flex: 1,
                  height: 13,
                  borderRadius: 4,
                  background: idx === 2 ? '#34D399' : '#FFFFFF12',
                  color: idx === 2 ? '#0B2A1E' : '#D6C7BD',
                  fontSize: 5,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {idx === 2 ? 'SELESAI' : 'MULAI MASAK'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportScreen() {
  const bars = [
    { label: 'Sen', value: 48 },
    { label: 'Sel', value: 66 },
    { label: 'Rab', value: 55 },
    { label: 'Kam', value: 78 },
    { label: 'Jum', value: 92 },
    { label: 'Sab', value: 100 },
    { label: 'Min', value: 72 },
  ];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: 286,
        borderRadius: 12,
        border: `1px solid ${BORDER}`,
        background: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 16px 30px ${DARK}14`,
      }}
    >
      <div
        style={{
          height: 26,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 11px',
          background: '#FFFDFB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <BarChart3 size={10} color={ORANGE} />
          <span style={{ fontSize: 8, fontWeight: 900, color: DARK }}>Laporan Penjualan</span>
        </div>
        <div
          style={{
            fontSize: 5.4,
            color: MUTED,
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: '2px 5px',
            fontWeight: 700,
          }}
        >
          MINGGU INI
        </div>
      </div>

      <div style={{ padding: 9, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Pendapatan', value: 'Rp 4,2 jt', color: ORANGE },
            { label: 'Pesanan', value: '128', color: DARK },
            { label: 'Rata-rata', value: 'Rp 32rb', color: DARK },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{
                flex: 1,
                background: '#FBF3EC',
                border: `1px solid ${BORDER}`,
                borderRadius: 7,
                padding: '6px 7px',
              }}
            >
              <div style={{ fontSize: 5.2, color: MUTED, fontWeight: 700 }}>{kpi.label}</div>
              <div style={{ fontSize: 8.5, color: kpi.color, fontWeight: 900, marginTop: 2 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 8,
            flex: 1,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: '8px 9px 6px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            background: '#FFFDFB',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 6, fontWeight: 800, color: DARK }}>Omzet Harian</span>
            <span style={{ fontSize: 5, color: MUTED }}>7 hari terakhir</span>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 5,
              marginTop: 7,
              paddingBottom: 11,
              position: 'relative',
              minHeight: 40,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 11,
                height: 1,
                background: BORDER,
              }}
            />
            {bars.map((bar) => (
              <div
                key={bar.label}
                style={{
                  flex: 1,
                  height: `${bar.value}%`,
                  background: bar.value === 100 ? ORANGE : '#FFC7B0',
                  borderRadius: '3px 3px 0 0',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 4.6,
                    color: MUTED,
                    fontWeight: 700,
                  }}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  num,
  title,
  tag,
  desc,
  children,
}: {
  num: string;
  title: string;
  tag: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: 13,
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        minHeight: 0,
        overflow: 'hidden',
        boxShadow: `0 10px 24px ${DARK}0A`,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: '#FBF3EC',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: 11,
          position: 'relative',
        }}
      >
        {children}
      </div>
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '0 2px 2px' }}>
        <div
          style={{
            width: 25,
            height: 25,
            borderRadius: 8,
            background: ORANGE_LIGHT,
            color: ORANGE,
            fontSize: 10,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {num}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.01em' }}>
            {title} <span style={{ color: ORANGE }}>· {tag}</span>
          </div>
          <div style={{ fontSize: 9.5, color: MUTED, marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
        </div>
      </div>
    </div>
  );
}

function PageTwo() {
  return (
    <section className="brochure-page" style={{ ...pageBase, background: PAPER, padding: '32px 42px 26px' }}>
      <div
        style={{
          position: 'absolute',
          top: -150,
          right: -140,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: '#FF6B350A',
        }}
      />

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <OrdioLogo scale={0.72} />
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: ORANGE,
            background: ORANGE_SOFT,
            border: `1px solid ${ORANGE_LIGHT}`,
            borderRadius: 999,
            padding: '6px 12px',
          }}
        >
          FITUR UNGGULAN
        </div>
      </header>

      <div style={{ marginTop: 22, marginBottom: 18, position: 'relative', zIndex: 2 }}>
        <h2
          style={{
            fontSize: 29,
            lineHeight: 1.12,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: 0,
            color: DARK,
          }}
        >
          Satu sistem, <span style={{ color: ORANGE }}>empat layar</span> yang bekerja bersamaan.
        </h2>
        <p style={{ fontSize: 10.5, color: MUTED, margin: '9px 0 0', lineHeight: 1.6, maxWidth: 470 }}>
          Dari meja pelanggan sampai laporan pemilik usaha — setiap pesanan mengalir otomatis tanpa
          perlu catat ulang.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 14,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <FeatureCard
          num="01"
          title="Customer Menu"
          tag="Pesan dari HP"
          desc="Pelanggan scan QR di meja, pilih menu, dan kirim pesanan langsung dari browser."
        >
          <CustomerScreen />
        </FeatureCard>

        <FeatureCard
          num="02"
          title="Kasir Dashboard"
          tag="Konfirmasi pembayaran"
          desc="Semua pesanan masuk tampil rapi. Kasir cukup konfirmasi pembayaran dengan satu klik."
        >
          <KasirScreen />
        </FeatureCard>

        <FeatureCard
          num="03"
          title="Kitchen Display"
          tag="Dapur real-time"
          desc="Tiket masuk ke layar dapur secara instan. Tanpa kertas, tanpa pesanan terlewat."
        >
          <KitchenScreen />
        </FeatureCard>

        <FeatureCard
          num="04"
          title="Laporan Penjualan"
          tag="Data yang jelas"
          desc="Pantau omzet, jumlah pesanan, dan performa harian dalam satu tampilan."
        >
          <ReportScreen />
        </FeatureCard>
      </div>

      <PageFooter page="02 / 03" bg={PAPER} />
    </section>
  );
}

function PricingCard({
  name,
  tagline,
  price,
  suffix,
  features,
  variant,
  badge,
}: {
  name: string;
  tagline: string;
  price: string;
  suffix: string;
  features: string[];
  variant: 'light' | 'featured' | 'dark';
  badge?: string;
}) {
  const dark = variant === 'dark';
  const featured = variant === 'featured';
  const text = dark ? '#FFFFFF' : DARK;
  const sub = dark ? '#B9AAA0' : MUTED;
  const line = dark ? '#FFFFFF1A' : BORDER;

  return (
    <div
      style={{
        position: 'relative',
        background: dark ? DARK : '#FFFFFF',
        border: `${featured ? 2 : 1}px solid ${featured ? ORANGE : line}`,
        borderRadius: 18,
        padding: featured ? '24px 18px 20px' : '22px 18px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: featured
          ? `0 20px 40px ${ORANGE}2E`
          : dark
            ? `0 16px 32px ${DARK}33`
            : `0 10px 24px ${DARK}0A`,
      }}
    >
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: -11,
            left: '50%',
            transform: 'translateX(-50%)',
            background: ORANGE,
            color: '#FFFFFF',
            fontSize: 7.5,
            fontWeight: 900,
            letterSpacing: '0.12em',
            padding: '5px 11px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            boxShadow: `0 6px 14px ${ORANGE}55`,
          }}
        >
          {badge}
        </div>
      )}

      <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: featured ? ORANGE : sub }}>
        {name.toUpperCase()}
      </div>
      <div style={{ fontSize: 9, color: sub, marginTop: 4, lineHeight: 1.45 }}>{tagline}</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: text, marginBottom: 4 }}>Rp</span>
        <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: text, lineHeight: 1 }}>
          {price}
        </span>
      </div>
      <div style={{ fontSize: 8.5, color: sub, fontWeight: 700, marginTop: 5 }}>{suffix}</div>

      <div style={{ height: 1, background: line, margin: '14px 0 12px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7.5, flex: 1 }}>
        {features.map((feature) => (
          <div key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <CheckCircle2 size={10.5} color={ORANGE} strokeWidth={2.6} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 9, color: dark ? '#D9CFC8' : MUTED, lineHeight: 1.45 }}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageThree() {
  return (
    <section className="brochure-page" style={{ ...pageBase, background: CREAM, padding: '32px 42px 26px' }}>
      <div
        style={{
          position: 'absolute',
          bottom: -170,
          right: -130,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: '#FF6B350D',
        }}
      />

      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <OrdioLogo scale={0.72} />
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: ORANGE,
            background: ORANGE_SOFT,
            border: `1px solid ${ORANGE_LIGHT}`,
            borderRadius: 999,
            padding: '6px 12px',
          }}
        >
          HARGA &amp; KONTAK
        </div>
      </header>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          position: 'relative',
          zIndex: 2,
        }}
      >
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 29,
            lineHeight: 1.12,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: 0,
            color: DARK,
          }}
        >
          Bayar Sekali, <span style={{ color: ORANGE }}>Milik Selamanya</span>
        </h2>
        <p style={{ fontSize: 10.5, color: MUTED, margin: '8px 0 0', lineHeight: 1.6 }}>
          Tanpa biaya bulanan. Sistem dengan nama dan brand restoran Anda sendiri.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 13,
          alignItems: 'stretch',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <PricingCard
          name="Basic"
          tagline="Untuk bisnis kuliner yang baru mulai"
          price="1.500.000"
          suffix="sekali bayar"
          variant="light"
          features={[
            'Sampai 10 meja',
            'Menu QR + Dashboard Kasir',
            'Branding & logo restoran Anda',
            'Setup & pelatihan',
            'Support 30 hari',
          ]}
        />
        <PricingCard
          name="Standard"
          tagline="Untuk restoran yang makin ramai"
          price="2.500.000"
          suffix="sekali bayar"
          variant="featured"
          badge="Paling Populer"
          features={[
            'Meja unlimited',
            'Semua fitur Basic',
            'Kitchen Display real-time',
            'Laporan penjualan + Export PDF',
            'Support 60 hari',
          ]}
        />
        <PricingCard
          name="Premium"
          tagline="Untuk operasional yang lengkap"
          price="3.500.000"
          suffix="sekali bayar"
          variant="dark"
          features={[
            'Semua fitur Standard',
            'Cetak kartu QR meja',
            'Setup di lokasi',
            'Support 90 hari',
          ]}
        />
      </div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: ORANGE,
            color: '#FFFFFF',
            padding: '13px 32px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 900,
            textDecoration: 'none',
            boxShadow: `0 14px 30px ${ORANGE}4D`,
          }}
        >
          Minta Demo
          <ArrowRight size={16} />
        </a>
        <div style={{ fontSize: 8.5, color: MUTED, marginTop: 8, fontWeight: 600 }}>
          Satu kali bayar &nbsp;·&nbsp; Milik selamanya &nbsp;·&nbsp; Setup dibantu tim Ordio
        </div>
      </div>

      <div
        style={{
          background: DARK,
          borderRadius: 17,
          padding: '17px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          position: 'relative',
          zIndex: 2,
          boxShadow: `0 16px 32px ${DARK}26`,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Butuh bantuan memilih paket?
          </div>
          <div style={{ fontSize: 9, color: '#B9AAA0', marginTop: 4, lineHeight: 1.5 }}>
            Tim Ordio siap membantu dengan demo langsung dan konsultasi.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: GREEN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <MessageCircle size={19} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.01em' }}>
              +62 878-5558-5366
            </div>
            <div
              style={{
                fontSize: 7.5,
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: GREEN,
                marginTop: 2,
              }}
            >
              CHAT WHATSAPP
            </div>
          </div>
          <div style={{ width: 1, height: 30, background: '#FFFFFF1A', marginLeft: 4 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Globe size={14} color={ORANGE} />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#D9CFC8', whiteSpace: 'nowrap' }}>
              Website: ordio.cc.cd
            </span>
          </div>
        </div>
      </div>
      </div>

      <div
        style={{
          marginTop: 'auto',
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 800, color: DARK }}>
          Ordio, Solusi Digital untuk Bisnis Kuliner
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 8.5, fontWeight: 600, color: MUTED }}>ordio.cc.cd</span>
          <span style={{ fontSize: 8.5, fontWeight: 800, color: ORANGE, letterSpacing: '0.12em' }}>03 / 03</span>
        </div>
      </div>
    </section>
  );
}

export default function Brochure() {
  return (
    <div
      className="brochure-root"
      style={{
        minHeight: '100vh',
        background: '#E9E3DD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        padding: '36px 16px 60px',
        fontFamily: FONT,
      }}
    >
      <style>{`
        @page { size: A4; margin: 0; }
        html, body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
          }
          .brochure-root {
            padding: 0 !important;
            gap: 0 !important;
            background: #FFFFFF !important;
            min-height: 0 !important;
          }
          .brochure-page {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
            break-after: page;
          }
          .brochure-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .brochure-print-btn {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <PageOne />
      <PageTwo />
      <PageThree />

      <button
        type="button"
        className="brochure-print-btn"
        onClick={() => window.print()}
        style={{
          position: 'fixed',
          right: 26,
          bottom: 26,
          zIndex: 50,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          background: ORANGE,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 999,
          padding: '14px 22px',
          fontSize: 13,
          fontWeight: 900,
          fontFamily: FONT,
          letterSpacing: '0.01em',
          cursor: 'pointer',
          boxShadow: `0 16px 34px ${ORANGE}66`,
        }}
      >
        <Printer size={18} />
        Cetak / Simpan PDF
      </button>
    </div>
  );
}
