export const metadata = {
  title: "Politique de confidentialité — Le Moulin de Balme",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[760px] mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-brown mb-12">
          Politique de confidentialité
        </h1>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Responsable du traitement</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Le Moulin de Balme — [Adresse] — [Email]
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Données collectées</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Dans le cadre de l&apos;utilisation de ce site, nous pouvons être amenés à collecter les données suivantes :
          </p>
          <ul className="mt-3 space-y-1 text-sm text-brown/70 list-disc list-inside">
            <li>Adresse e-mail (inscription à la newsletter)</li>
            <li>Informations de commande Click &amp; Collect (nom, prénom, email, téléphone)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Finalités du traitement</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Les données collectées sont utilisées exclusivement pour :
          </p>
          <ul className="mt-3 space-y-1 text-sm text-brown/70 list-disc list-inside">
            <li>Gérer les commandes et réservations Click &amp; Collect</li>
            <li>Envoyer notre newsletter (sur consentement explicite)</li>
          </ul>
          <p className="text-sm text-brown/70 leading-relaxed mt-3">
            Elles ne sont jamais transmises à des tiers à des fins commerciales.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Durée de conservation</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Les données de commande sont conservées 3 ans à compter de la dernière commande. Les adresses email de newsletter sont conservées jusqu&apos;à désinscription.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Vos droits</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition à vos données personnelles. Pour exercer ces droits, contactez-nous à [email].
          </p>
        </section>

        <section>
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brown mb-3">Cookies</h2>
          <p className="text-sm text-brown/70 leading-relaxed">
            Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (session, panier). Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé.
          </p>
        </section>
      </div>
    </div>
  );
}
