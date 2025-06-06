import { Link, Text, View } from "@react-pdf/renderer";

import ListItem from "../../components/ListItem";
import PdfPage from "../../components/PdfPage";
import PdfPageSubtitle from "../../components/PdfPageSubtitle";
import { pageIds } from "../../pageIds";
import { tw } from "../../styles";

export default function SocioEconomicImpactsIntroductionPage() {
  return (
    <PdfPage id={pageIds["impacts-socio-economic"]}>
      <PdfPageSubtitle>1.2 Impacts socio-économiques</PdfPageSubtitle>
      <Text style={tw("mb-2")}>
        L'évaluation socio-économique a pour objet d'apprécier l'intérêt d'un projet ou d'un
        investissement pour la collectivité.
      </Text>
      <Text style={tw("mb-2")}>
        Elle est réalisée en analysant les effets du projet (ses impacts) sur les différents types
        d'acteurs directement ou indirectement concernés, que ces impacts soient positifs ou
        négatifs. On parle alors d'impacts socio-économiques.
      </Text>
      <Text style={tw("mb-2")}>
        S'agissant de projets de renouvellement urbain, les impacts sont nombreux et de différentes
        natures : environnementaux (ex : maintien de capacité de stockage de carbone dans les sols,
        création d'ilots de fraicheur), économiques (ex : réduction de dépenses futures en entretien
        de réseaux ou voiries), sociaux (ex : création d'aménités, amélioration de l'attractivité
        d'un quartier, réduction du besoin en en déplacements, etc.).
      </Text>
      <Text style={tw("mb-2")}>
        Afin de pouvoir comparer les valeurs de ces indicateurs au bilan de l'opération (qui est
        exprimé en €), il est nécessaire de convertir celles qui ne sont naturellement pas exprimées
        en € (ex : tonnes de CO2 évitées, surfaces désimperméabilisées) en valeurs monétaires. On
        parle alors de ”monétarisation”.
      </Text>
      <Text style={tw("mb-2")}>
        Les différents indicateurs utilisés dans Bénéfriches sont présentés ci-contre et leurs
        méthodes de calcul sont détaillées au niveau de chacun.
      </Text>
      <View style={tw("mb-4")}>
        <Text>Les impacts socio-économiques sont classés en 4 catégories :</Text>
        <ListItem>
          <Link src="#impacts.socio_economic.economic_direct">
            💰 les impacts économiques directs
          </Link>
        </ListItem>
        <ListItem>
          <Link src="#impacts.socio_economic.economic_indirect">
            🪙 les impacts économiques indirects
          </Link>
        </ListItem>
        <ListItem>
          <Link src="#impacts.socio_economic.social_monetary">
            🚶 les impacts sociaux monétarisés
          </Link>
        </ListItem>
        <ListItem>
          <Link src="#impacts.socio_economic.environmental_monetary">
            🌳 les impacts environnementaux monétarisés
          </Link>
        </ListItem>
      </View>
      <View style={tw("mb-4")}>
        <Text>Aller plus loin</Text>
        <ListItem>
          <Text>
            Évaluer les bénéfices socio-économiques de la reconversion de friches pour lutter contre
            l'artificialisation :{" "}
          </Text>
          <Link src="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
            Outil Bénéfriches.
          </Link>
        </ListItem>
        <ListItem>
          <Text>Évaluation socioéconomique des opérations d'aménagement urbain : </Text>
          <Link src="https://www.strategie.gouv.fr/publications/referentiel-methodologique-de-levaluation-socioeconomique-operations-damenagement">
            Référentiel méthodologique
          </Link>
        </ListItem>
      </View>
    </PdfPage>
  );
}
