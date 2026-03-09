import { ProductSpecification } from '@/app/generated/prisma/client';

export default function ProductSpecifications({ specifications }: { specifications: ProductSpecification[] }) {
    if (!specifications || specifications.length === 0) return null;

    return (
        <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold text-base">Spesifikasi Produk</h3>
            <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm text-left">
                    <tbody className="divide-y">
                        {specifications.map((spec) => (
                            <tr key={spec.id} className="divide-x bg-muted/20">
                                <th className="px-4 py-2 font-medium text-muted-foreground w-1/3 bg-muted/50">
                                    {spec.key}
                                </th>
                                <td className="px-4 py-2 font-medium">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
