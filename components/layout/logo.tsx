import Image from "next/image";
import Link from "next/link";

type Props = {
  locale: string;
};

export default function Logo({ locale }: Props) {
  return (
    <Link href={`/${locale}`} className="flex items-center">
      <Image
        src="/branding/logo-white.png"
        alt="IntegratESG"
        width={210}
        height={50}
        priority
        className="h-auto w-42.5"
      />
    </Link>
  );
}
