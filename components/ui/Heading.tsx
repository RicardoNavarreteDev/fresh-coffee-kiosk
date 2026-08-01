

export default function Heading({children}: {children: React.ReactNode}) {
  return (
    <h1 className="my-8 text-3xl font-semibold tracking-tight text-slate-900 lg:my-10 lg:text-4xl">
        {children}
    </h1>
  )
}
