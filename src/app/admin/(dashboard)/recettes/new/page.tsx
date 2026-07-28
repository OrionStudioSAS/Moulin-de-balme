import RecipeForm from "@/components/admin/RecipeForm";

export default function NewRecettePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brown uppercase tracking-tight mb-8">
        Nouvelle recette
      </h1>
      <RecipeForm />
    </div>
  );
}
