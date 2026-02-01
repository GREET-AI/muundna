import Link from 'next/link';

interface ContentSectionProps {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}

export default function ContentSection({ title, items }: ContentSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

