'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from '@/features/notifications/actions/notification.actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: Date;
};

export function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (!session?.user?.id) return;

        const channelName = `user-${session.user.id}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind('notification', (data: any) => {

            const newNotification = {
                ...data,
                createdAt: new Date(data.createdAt),
                isRead: false
            };

            setNotifications((prev) => {
                if (prev.some(n => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
            setUnreadCount((prev) => prev + 1);

            toast(data.title, {
                icon: '🔔',
                duration: 4000
            });

        });

        return () => {
            pusherClient.unsubscribe(channelName);
        };
    }, [session?.user?.id]);

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
    };

    const fetchUnreadCount = async () => {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
    };

    const handleMarkAsRead = async (id: string, link: string | null) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await markNotificationAsRead(id);

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        await markAllNotificationsAsRead();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-background" />
                    )}
                    <span className="sr-only">Notifikasi</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="font-semibold text-sm">Notifikasi</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                handleMarkAllRead();
                            }}
                        >
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Tidak ada notifikasi
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                        !notification.isRead && "bg-muted/50"
                                    )}
                                    onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                >
                                    <div className="flex w-full justify-between items-start gap-2">
                                        <span className={cn("font-medium text-sm", !notification.isRead && "text-primary")}>
                                            {notification.title}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
