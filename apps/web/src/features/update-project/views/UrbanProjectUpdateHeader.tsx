function UrbanProjectUpdateHeader({ projectName }: { projectName: string }) {
  return (
    <div className="flex flex-col">
      Modification du projet{" "}
      <span className="mt-1 text-sm uppercase font-normal text-dsfr-text-label-grey">
        {projectName}
      </span>
    </div>
  );
}

export default UrbanProjectUpdateHeader;
