import { Navbar } from '@/components/layouts/customer/navbar';
import { Footer } from '@/components/layouts/customer/footer';

import { getStoreSettings } from '@/features/settings/actions/settings.actions';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { GridPattern } from '@/components/ui/grid-pattern';

export default async function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await getStoreSettings();
    const settings = 'settings' in result ? result.settings : null;
    const storeName = settings?.storeName;

    return (
        <div className="flex min-h-screen flex-col max-w-8xl relative isolate">
            {/* Dynamic Background */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
                <GridPattern
                    width={40}
                    height={40}
                    x={-1}
                    y={-1}
                    strokeDasharray={"4 2"}
                    className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)] opacity-50 absolute inset-0 h-full w-full"
                />
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,oklch(var(--primary)/0.15),rgba(255,255,255,0))] blur-[100px] dark:bg-[radial-gradient(circle_farthest-side,oklch(var(--primary)/0.25),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,oklch(var(--secondary)/0.15),rgba(255,255,255,0))] blur-[100px] dark:bg-[radial-gradient(circle_farthest-side,oklch(var(--secondary)/0.25),rgba(255,255,255,0))]"></div>
            </div>

            <Navbar storeName={storeName} />
            <div className="container mx-auto px-2">
                <main className="flex-1">{children}</main>
                <Footer settings={settings} />
            </div>
            <WhatsAppButton phoneNumber={settings?.whatsappNumber} />
        </div>
    );
}
