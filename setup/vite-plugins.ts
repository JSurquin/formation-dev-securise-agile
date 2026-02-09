import { defineVitePluginsSetup } from "@slidev/types";

export default defineVitePluginsSetup((options) => {
  console.warn(
    "Plugin long-code-sharp-in-pdf: Démarrage du traitement des slides",
  );
  console.warn(`Nombre de slides à traiter: ${options.data.slides.length}`);

  return [
    {
      name: "slidev-plugin-long-code",
      transform(code, id) {
        if (!id.endsWith(".md")) return;

        // Ajout du message de debug avec un style similaire à slidev-addon-narrator
        const debugMessage = `
<div class="fixed bottom-5 right-5 z-50 bg-blue-500 text-white px-4 py-2 rounded shadow">
  Debug: Plugin actif sur cette slide
</div>
`;

        return {
          code: `${code}\n\n---\n\n${debugMessage}`,
          map: null,
        };
      },
    },
  ];
});
