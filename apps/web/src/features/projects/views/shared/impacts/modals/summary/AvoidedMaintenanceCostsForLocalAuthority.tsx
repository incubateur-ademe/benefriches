import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

type Props = {
  impactData: {
    isSuccess: boolean;
    value: number;
  };
};

const SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;

  const title = isSuccess
    ? "✅ Des dépenses de fonctionnement à la charge de la collectivité réduites"
    : "🚨 Des dépenses de fonctionnement à la charge de la collectivité maintenues ";

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: formatMonetaryImpact(value),
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `économisés par la collectivité grâce à la reconversion de la friche`
            : `toujours à la charge de la collectivité`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent noTitle>
        {isSuccess ? (
          <>
            <p>
              Un site qui reste en l'état, sans intervention, induit des coûts importants, à la
              charge de l'ancien exploitant du site ou du propriétaire du terrain. En effet, lorsque
              ces derniers sont défaillants, ou que le site soit sous la responsabilité d’un
              liquidateur, c’est souvent la commune qui se substitue à eux pour éviter les
              dégradations ou intrusions et ainsi réduire les risques d’accidents et la perte de
              valeur du site / terrain.
            </p>
            <p>
              Par ailleurs, un projet sur friche est généralement plus compact que le même projet
              réalisé sur des espaces agricoles, naturels ou forestiers, ce qui permet d’économiser
              dans l’entretien des VRD.
            </p>
            <p>Ainsi, reconvertir une friche permet d’économiser ces dépenses !</p>
          </>
        ) : (
          <>
            <p>
              Un site qui reste en l'état, sans intervention, induit des coûts importants, à la
              charge de l'ancien exploitant du site ou du propriétaire du terrain. En effet, lorsque
              ces derniers sont défaillants, ou que le site soit sous la responsabilité d’un
              liquidateur, c’est souvent la commune qui se substitue à eux pour éviter les
              dégradations ou intrusions et ainsi réduire les risques d’accidents et la perte de
              valeur du site / terrain.
            </p>
            <p>
              Par ailleurs, un projet sur espaces agricoles, naturels ou forestiers friche est
              généralement moins compact que le même projet réalisé sur friche, ce qui conduit à des
              frais d’entretien des VRD accrus.
            </p>
            <p>Ainsi, conserver un site en friche maintient ces dépenses&nbsp;!</p>
          </>
        )}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryAvoidedMaintenanceCostsForLocalAuthorityDescription;
