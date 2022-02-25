import { ReactChild, ReactNode } from "react";

type ContainerProps = {
	children: ReactChild[];
};

const Container = ({ children }: ContainerProps): JSX.Element => {
	return <div className="container">{children}</div>;
};

export default Container;
