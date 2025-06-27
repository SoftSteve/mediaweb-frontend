import ListingCard from './ListingCards';
import { IoLogoVenmo, IoCardOutline } from 'react-icons/io5';

export default function More({ eventSpace }) {
  if (!eventSpace) return <p className="p-4">Loading…</p>;

  const {
    donate_page_title,
    donate_page_description,
    name,
    donation_funds: funds = [],
  } = eventSpace;

  if (!funds.length) return <p className="p-4">No donation funds yet.</p>;

  return (
    <div className="w-full flex flex-col px-6 py-4 gap-4">
      <header>
        <h1 className="text-2xl font-semibold">
          {donate_page_title || name}
        </h1>
        {donate_page_description && (
          <p className="text-md text-gray-500">{donate_page_description}</p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6">
        {funds.map((fund) => (
          <ListingCard
            key={fund.id}
            imgSrc={fund.card_cover_image}
            title={fund.card_title}
            description={fund.card_description}
            venmoLink={{
              href: fund.card_venmo_link,
              icon: <IoLogoVenmo />,
              label: 'Venmo',
            }}
            donoLink={{
              href: fund.card_dono_link,
              icon: <IoCardOutline />, 
              label: 'PayPal',
            }}
          />
        ))}
      </div>
    </div>
  );
}