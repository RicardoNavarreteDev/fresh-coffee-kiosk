import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string
  className?: string
  imageClassName?: string
}

export default function Logo({ href = '/', className = 'mt-5 flex justify-center', imageClassName = 'relative h-40 w-40 transition hover:scale-[1.02]' }: LogoProps) {
  return (
    <div className={className}>
      <Link href={href} className={imageClassName}>
        <Image 
            fill
            alt="Logotipo Fresh Coffee"
            src='/logo.svg'
        />
      </Link>
    </div>
  )
}
