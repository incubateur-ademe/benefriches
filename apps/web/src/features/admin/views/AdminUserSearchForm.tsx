import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useForm } from "react-hook-form";

type Props = {
  search: string;
  onSearchSubmitted: (search: string) => void;
};

type SearchFormValues = { search: string };

function AdminUserSearchForm({ search, onSearchSubmitted }: Props) {
  // `values` (not `defaultValues`): the search reaches the store after the first render.
  const { register, handleSubmit } = useForm<SearchFormValues>({
    values: { search },
  });

  return (
    <form
      className="flex flex-wrap items-end gap-4 mb-6"
      onSubmit={handleSubmit((values) => {
        onSearchSubmitted(values.search.trim());
      })}
    >
      <Input
        label="Rechercher un utilisateur"
        hintText="Email, nom ou structure"
        className="mb-0 grow max-w-xl"
        nativeInputProps={{ ...register("search"), type: "search" }}
      />
      <Button type="submit" iconId="fr-icon-search-line">
        Rechercher
      </Button>
    </form>
  );
}

export default AdminUserSearchForm;
