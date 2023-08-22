import Button from "../../components/atom/button";
import { ReactComponent as AddIcon } from "../../assets/img/addIcon.svg";

const HomePage = () => {
  return (
    <h1>
      <Button
        type="button"
        text="Deposit"
        onClick={() => console.log("click")}
        variant="primary"
        size="small"
        icon={<AddIcon />}
      />
    </h1>
  );
};
export default HomePage;
