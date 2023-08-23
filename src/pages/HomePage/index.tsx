import { ReactComponent as DotToken } from "../../assets/img/dotToken.svg";
import { ReactComponent as AddToken } from "../../assets/img/addIcon.svg";
import Button from "../../components/atom/button";

const HomePage = () => {
  return (
    <h1>
      <Button text="New Position" type="button" onClick={() => console.log("click")} variant="primary" size="large" />
      <br />
      <Button
        text="Deposit"
        type="button"
        onClick={() => console.log("click")}
        variant="primary"
        size="small"
        icon={<AddToken />}
      />
      <br />
      <Button text="{Enter button text}" type="button" onClick={() => console.log("click")} variant="interactive" />
      <br />
      <Button
        text="{Enter button text}"
        type="button"
        onClick={() => console.log("click")}
        variant="interactive"
        disabled={true}
      />
      <br />
      <Button text="{Enter button text}" type="button" onClick={() => console.log("click")} variant="secondary" />
      <br />
      <Button text="Select token" type="button" onClick={() => console.log("click")} variant="primary-select" />
      <br />
      <Button
        text="DOT"
        type="button"
        onClick={() => console.log("click")}
        variant="secondary-select"
        icon={<DotToken />}
      />
      <br />
      <Button
        text="DOT"
        type="button"
        onClick={() => console.log("click")}
        variant="secondary-select"
        icon={<DotToken />}
        disabled={true}
      />
      <br />
    </h1>
  );
};
export default HomePage;
