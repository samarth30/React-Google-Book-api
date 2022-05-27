import React, { useState } from "react";
import { Card, CardTitle, CardImg, Input } from "reactstrap";
const BookCardSaved = ({
  item,
  isChecked,
  handleCheck,
  thumbnail,
  title,
  authors,
  publisher,
}) => {
  const [checked, setChecked] = useState(isChecked);
  console.log(checked);
  return (
    <Card style={{ width: "233px" }} className="m-auto ">
      <CardImg
        top
        style={{ width: "100%", height: "233px" }}
        src={thumbnail}
        alt={title}
      />

      <CardTitle className="card-title">title : {title}</CardTitle>
      <CardTitle className="card-title">Authors : {authors}</CardTitle>

      <div>Publisher : {publisher}</div>
      <Input
        type="checkbox"
        checked={checked}
        onClick={() => {
          handleCheck(item, !checked);
          setChecked(!checked);
        }}
      />
    </Card>
  );
};

export default BookCardSaved;
