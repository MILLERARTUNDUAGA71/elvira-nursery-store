import { Leaf, Sprout, Flower2, ArrowRight } from 'lucide-react'

const floatingLeaves = [
{ Icon: Leaf, top: '10%', left: '8%', size: 28, delay: '0s', duration: '7s' },
{ Icon: Sprout, top: '70%', left: '15%', size: 22, delay: '1.2s', duration: '9s' },
{ Icon: Flower2, top: '20%', left: '85%', size: 26, delay: '0.6s', duration: '8s' },
{ Icon: Leaf, top: '75%', left: '80%', size: 20, delay: '2s', duration: '6.5s' },
{ Icon: Sprout, top: '45%', left: '92%', size: 18, delay: '1.5s', duration: '10s' },
{ Icon: Leaf, top: '55%', left: '4%', size: 24, delay: '0.3s', duration: '7.5s' },
]

export default function Hero() {
return (
<section className="relative overflow-hidden min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700 bg-[length:200%_200%] animate-gradient-shift">
{/* Leaves flotando */}
{floatingLeaves.map(({ Icon, top, left, size, delay, duration }, i) => (
<Icon
key={i}
className="absolute text-amber-200/30 animate-float pointer-events-none"
style={{
top,
left,
width: size,
height: size,
animationDelay: delay,
animationDuration: duration,
}}
/>
))}

{/* Contenido */}
<div className="relative z-10 text-center px-6 max-w-2xl">
<h1 className="text-4xl md:text-6xl font-serif text-white mb-4 drop-shadow-md">
Plantas, palmas y arbustos
</h1>
<p className="text-lg md:text-xl text-emerald-50/90 mb-8">
listos para su próximo proyecto.
</p>
<a
href="#catalogo"
className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold px-6 py-3 rounded-full transition-colors shadow-lg"
>
Ver catálogo
<ArrowRight size={18} />
</a>
</div>

<style>{`
@keyframes gradient-shift {
0%, 100% { background-position: 0% 50%; }
50% { background-position: 100% 50%; }
}
.animate-gradient-shift {
animation: gradient-shift 12s ease-in-out infinite;
}
@keyframes float {
0%, 100% { transform: translateY(0px) rotate(0deg); }
50% { transform: translateY(-18px) rotate(8deg); }
}
.animate-float {
animation: float 8s ease-in-out infinite;
}
`}</style>
</section>
)
}
