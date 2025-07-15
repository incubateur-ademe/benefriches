type Props = {
  imageUrl: string;
};

const ScenarioTileImage = ({ imageUrl }: Props) => {
  return (
    <div className="fr-tile__header">
      <div className="fr-tile__pictogram">
        <img
          className="fr-responsive-img"
          src={imageUrl}
          aria-hidden={true}
          alt=""
          width="80px"
          height="80px"
        />
      </div>
    </div>
  );
};

export default ScenarioTileImage;
