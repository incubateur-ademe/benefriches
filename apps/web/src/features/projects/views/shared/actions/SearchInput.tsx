import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";

function SearchInput() {
  return (
    <div>
      <SearchBar label="Rechercher un indicateur" onButtonClick={function noRefCheck() {}} />
    </div>
  );
}

export default SearchInput;
