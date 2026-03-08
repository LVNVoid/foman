import 'dotenv/config';
import { Role } from '../app/generated/prisma/client';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      phoneNumber: '08123456789',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@gmail.com',
      password: userPassword,
      phoneNumber: '08123456788',
      role: Role.CUSTOMER,
    },
  });

  console.log('✅ Users:', admin.email, '|', user.email);

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'spanduk-banner' },
      update: {},
      create: { name: 'Spanduk & Banner', slug: 'spanduk-banner' },
    }),
    prisma.category.upsert({
      where: { slug: 'kartu-nama' },
      update: {},
      create: { name: 'Kartu Nama', slug: 'kartu-nama' },
    }),
    prisma.category.upsert({
      where: { slug: 'brosur-flyer' },
      update: {},
      create: { name: 'Brosur & Flyer', slug: 'brosur-flyer' },
    }),
  ]);

  console.log('✅ Categories:', categories.map((c) => c.name).join(', '));

  // ── Products ──────────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'spanduk-flexi-indoor' },
      update: {},
      create: {
        name: 'Spanduk Flexi Indoor',
        description:
          'Cetak spanduk bahan flexi indoor 280gsm. Harga per meter persegi.',
        price: 25000,
        slug: 'spanduk-flexi-indoor',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'kartu-nama-100pcs' },
      update: {},
      create: {
        name: 'Kartu Nama Art Carton (100 pcs)',
        description:
          'Kartu nama art carton 260gsm finishing glossy/matte, ukuran 9x5.5cm.',
        price: 35000,
        slug: 'kartu-nama-100pcs',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'flyer-a5-100pcs' },
      update: {},
      create: {
        name: 'Flyer A5 (100 pcs)',
        description: 'Cetak flyer A5 art paper 150gsm full color dua sisi.',
        price: 55000,
        slug: 'flyer-a5-100pcs',
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log('✅ Products:', products.map((p) => p.name).join(', '));

  // ── Banner ────────────────────────────────────────────────────────────────
  await prisma.banner.upsert({
    where: { id: 'banner-seed-01' },
    update: {},
    create: {
      id: 'banner-seed-01',
      title: 'Cetak Spanduk & Banner – Harga Terjangkau, Kualitas Premium',
      imageUrl: 'https://placehold.co/1200x400?text=Cetak+Spanduk',
      link: '/products',
      active: true,
    },
  });

  console.log('✅ Banner created');

  // ── Store Settings ────────────────────────────────────────────────────────
  const settingsCount = await prisma.storeSettings.count();
  if (settingsCount === 0) {
    await prisma.storeSettings.create({
      data: {
        storeName: 'Cetak Jaya',
        whatsappNumber: '6281234567890',
        contactEmail: 'order@cetakjaya.com',
        contactPhone: '+62 274-123-4567',
        contactAddress: 'Jl. Malioboro No. 88, Yogyakarta',
        openDays: 'Senin - Sabtu',
        openHours: '08:00 - 21:00',
      },
    });
    console.log('✅ Store settings created');
  }

  // ── Order ─────────────────────────────────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'PAID',
      total: products[0].price + products[1].price,
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: products[0].price },
          { productId: products[1].id, quantity: 1, price: products[1].price },
        ],
      },
    },
  });

  console.log('✅ Order created:', order.id);

  // ── Notification ──────────────────────────────────────────────────────────
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Pesanan Sedang Diproses',
      message: `Pesanan #${order.id.slice(0, 8)} sudah kami terima dan sedang dalam proses cetak.`,
      type: 'ORDER',
      link: `/orders/${order.id}`,
    },
  });

  console.log('✅ Notification created');

  console.log('\n🎉 Seeding selesai!\n');
  console.log('┌──────────────────────────────────────────┐');
  console.log('│  🔐 Admin → admin@gmail.com / admin123   │');
  console.log('│  👤 User  → user@gmail.com  / user123    │');
  console.log('└──────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
