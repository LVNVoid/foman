import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProfileForm } from '@/features/profile/components/profile-form';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            redirect('/login');
        }

        const plainUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profileUrl: user.profileUrl,
        };

        return (
            <div className="container py-10">
                <ProfileForm user={plainUser} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return <div>Gagal memuat profil. Silakan coba lagi nanti.</div>;
    }
}
