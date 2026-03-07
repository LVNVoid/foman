import { CheckCircle2, Zap, Leaf, ShieldCheck } from 'lucide-react';

const features = [
    {
        title: 'Kualitas Premium',
        description: 'Kami menggunakan bahan terbaik dan teknologi pencetakan terbaru untuk memastikan hasil cetak Anda sempurna.',
        icon: CheckCircle2,
    },
    {
        title: 'Pengerjaan Cepat',
        description: 'Butuh cepat? Kami menawarkan opsi pengiriman hari yang sama dan hari berikutnya untuk sebagian besar produk.',
        icon: Zap,
    },
    {
        title: 'Ramah Lingkungan',
        description: 'Kami berkomitmen pada keberlanjutan dengan opsi kertas daur ulang dan tinta berbasis kedelai.',
        icon: Leaf,
    },
    {
        title: 'Jaminan Kepuasan',
        description: 'Tidak puas dengan pesanan Anda? Kami akan mencetak ulang atau memberikan pengembalian dana penuh. Tanpa banyak tanya.',
        icon: ShieldCheck,
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
                        Mengapa Memilih PrintMaster?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Kami lebih dari sekadar perusahaan percetakan. Kami adalah mitra sukses Anda.
                        Inilah mengapa ribuan bisnis mempercayakan kebutuhan percetakan mereka kepada kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-lg">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
