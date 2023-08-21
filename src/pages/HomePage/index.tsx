import Button from "../../components/atom/button";

const HomePage = () => {
  return (
    <h1>
      <Button
        type="button"
        text="{Enter button text}"
        onClick={() => console.log("click")}
        styles="button-primary-small"
        hasAddIcon={true}
        disabled={false}
      />
    </h1>
  );
};
export default HomePage;
