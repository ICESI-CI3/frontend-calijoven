export default function Home() {
  return (
    <main className="bg-background flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          {/* Header con gradiente */}
          <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
            <h1 className="mb-4 text-4xl font-bold text-white">Bienvenido a Cali Joven</h1>
            <p className="text-lg text-blue-100">
              Tu plataforma para explorar oportunidades y recursos para jóvenes en Cali.
            </p>
          </div>

          {/* Sección de características */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl text-blue-600">📰</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-blue-600">Publicaciones</h2>
              <p className="text-gray-600">
                Explora las últimas publicaciones y noticias relevantes para jóvenes.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl text-purple-600">📢</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-purple-600">Comunicaciones</h2>
              <p className="text-gray-600">
                Mantente informado sobre eventos y actividades en tu comunidad.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl text-green-600">📚</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-green-600">Recursos</h2>
              <p className="text-gray-600">
                Accede a recursos y herramientas para tu desarrollo personal y profesional.
              </p>
            </div>
          </div>

          {/* Sección de llamada a la acción */}
          <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-center shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-white">¿Listo para comenzar?</h2>
            <p className="mb-6 text-indigo-100">
              Únete a nuestra comunidad y descubre todas las oportunidades que tenemos para ti.
            </p>
            <button className="rounded-md bg-white px-6 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50">
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
