import classNames from "classnames";
import React, { cloneElement, FC, ReactElement, ReactNode } from "react";

import "./style.scss";

interface TableProps {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  loading?: ReactNode;
  onClick?: () => void;
}

interface TableComponent extends FC<TableProps> {
  Head: FC<TableProps>;
  Body: FC<TableProps>;
  TH: FC<TableProps>;
  TR: FC<TableProps>;
  TD: FC<TableProps>;
}

interface TRProps extends TableProps {
  loading?: ReactNode | null;
}

const Table: TableComponent = ({ children, className, loading }: TableProps) => {
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child as ReactElement<TableProps>, { loading });
    }
    return child;
  });

  return (
    <table className={`custom-table ${className || ""}`} cellSpacing="10">
      {clonedChildren}
    </table>
  );
};

Table.Head = ({ children }: TableProps) => {
  return <thead>{children}</thead>;
};

Table.Body = ({ children, className, loading }: TableProps) => {
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child as ReactElement<TRProps>, { loading });
    }
    return child;
  });

  return <tbody className={className || ""}>{clonedChildren}</tbody>;
};

Table.TH = ({ children, className }: TableProps) => {
  return <th className={`relative ${className || ""}`}>{children}</th>;
};

Table.TR = ({ children, className, loading, onClick }: TableProps) => {
  if (loading) {
    return <>{loading}</>;
  }

  return (
    <tr
      className={classNames(className, {
        "cursor-pointer": onClick,
      })}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

Table.TD = ({ children, className, onClick, colSpan = 0 }: TableProps) => {
  return (
    <td
      colSpan={colSpan}
      className={classNames(className, {
        "cursor-pointer": onClick,
      })}
    >
      {children}
    </td>
  );
};

Table.Head.displayName = "Head";
Table.Body.displayName = "Body";
Table.TH.displayName = "TH";
Table.TR.displayName = "TR";
Table.TD.displayName = "TD";

export default Table;
