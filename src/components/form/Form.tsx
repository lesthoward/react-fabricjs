import { fabric } from "fabric";
import { ChangeEvent, useEffect, useState } from "react";
import { makePath } from "../../helpers/canvasHelper";
import { addPoint, removePaths } from "../../helpers/tooltipHelper";
import { useAppDispatch, useAppSelector } from "../../state/hook";

type TFormValues = {
	radius: string | number;
};

const Form = () => {
	const {
		canvasRef: canvas,
		selectedWall,
		points,
	} = useAppSelector((state) => state.canvas);
	const dispatch = useAppDispatch();

	const [formValues, setFormValues] = useState<TFormValues>({
		radius: 0,
	});

	const getAngle = (coords: IExtendedPath["path"]) => {
		const x1 = coords[0][1];
		const y1 = coords[0][2];
		const x2 = coords[1][3];
		const y2 = coords[1][4];

		const angleY = y2 - y1;
		const angleX = x2 - x1;

		let angle = Math.atan2(angleY, angleX);
		angle *= 180 / Math.PI;
		return angle;
	};

	const getAngle360 = (path: IExtendedPath["path"]) => {
		var theta = getAngle(path); // range (-180, 180]
		if (theta < 0) theta = 360 + theta; // range [0, 360)
		return theta;
	};

	const handleRadius = () => {
		if (!selectedWall) return;
		const { radius: rString } = formValues;
		const radius = Number(rString) > 0 ? (Number(rString) * 1) / 100 : 0;

		const angle360 = getAngle360(selectedWall.path);

        console.log("🚀 ~ file: Form.tsx ~ line 49 ~ handleRadius ~ angle360", angle360)

		let centerX = selectedWall.path[1][1];
		let centerY = selectedWall.path[1][2];

		const x1 = selectedWall.path[0][1];
		const y1 = selectedWall.path[0][2];
		const x2 = selectedWall.path[1][3];
		const y2 = selectedWall.path[1][4];

		const xMagnitude = Math.abs(x2 - x1);
		const yMagnitude = Math.abs(y2 - y1);
		const large = xMagnitude + yMagnitude;

		// if(radius === 0) return

		const hick = large / 2;
		const point = new fabric.Point(centerX, centerY);
		

		selectedWall.data.radius.x = false
		selectedWall.data.radius.y = false

		if (angle360 >= 0 && angle360 <= 90) {
			const xRadius = x1 + hick;
			const yRadius = y2 - hick;
			const curvedPoint = new fabric.Point(xRadius, yRadius);

			let interpolation = { x: 0, y: 0 } as fabric.Point;
			
			if(radius < selectedWall.data.prevRadius) {
				const prevMidPoint = selectedWall.getCenterPoint()
				interpolation = point.lerp(new fabric.Point(prevMidPoint.x, prevMidPoint.y), 1 - radius);
			} else {
				interpolation = point.lerp(curvedPoint, radius);
			}
			
			centerY = interpolation.y;
			centerX = interpolation.x;
		} else if(angle360 >= 180 && angle360 <= 270) {
			const xRadius = x1 - hick;
			const yRadius = y2 + hick;
			const curvedPoint = new fabric.Point(xRadius, yRadius);

			let interpolation = { x: 0, y: 0 } as fabric.Point;
			
			if(radius < selectedWall.data.prevRadius) {
				const prevMidPoint = selectedWall.getCenterPoint()
				interpolation = point.lerp(new fabric.Point(prevMidPoint.x, prevMidPoint.y), 1 - radius);
			} else {
				interpolation = point.lerp(curvedPoint, radius);
			}
			
			centerY = interpolation.y;
			centerX = interpolation.x;
		} else if(angle360 > 90 && angle360 < 180){
			const xRadius = x2 + hick;
			const yRadius = y1 + hick;
			const curvedPoint = new fabric.Point(xRadius, yRadius);

			let interpolation = { x: 0, y: 0 } as fabric.Point;
			
			if(radius < selectedWall.data.prevRadius) {
				const prevMidPoint = selectedWall.getCenterPoint()
				interpolation = point.lerp(new fabric.Point(prevMidPoint.x, prevMidPoint.y), 1 - radius);
			} else {
				interpolation = point.lerp(curvedPoint, radius);
			}
			
			centerY = interpolation.y;
			centerX = interpolation.x;
		} else if (angle360 > 270 && angle360 < 360) {
			console.log('here')

			const xRadius = x2 - hick;
			const yRadius = y1 - hick;
			const curvedPoint = new fabric.Point(xRadius, yRadius);

			let interpolation = { x: 0, y: 0 } as fabric.Point;
			
			if(radius < selectedWall.data.prevRadius) {
				const prevMidPoint = selectedWall.getCenterPoint()
				interpolation = point.lerp(new fabric.Point(prevMidPoint.x, prevMidPoint.y), 1 - radius);
			} else {
				interpolation = point.lerp(curvedPoint, radius);
			}
			
			centerY = interpolation.y;
			centerX = interpolation.x;
		}

		const fabricPath: fabric.Path = makePath({
			x1,
			y1,
			x2,
			y2,
			curveX: Number(centerX),
			curveY: Number(centerY),
		});

		selectedWall.set({ path: fabricPath.path });

		canvas?.renderAll();
		selectedWall.data.prevRadius = radius;
	};

	const handleAddPoint = () => {
		if (!canvas || !selectedWall) return;
		addPoint(canvas, points, selectedWall, dispatch);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9-]+$/;
		if (regex.test(e.target.value)) {
			setFormValues({
				...formValues,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleRemoveWall = () => {
		if (!canvas || !selectedWall) return;
		removePaths(canvas, points, selectedWall, dispatch);
	};

	const addCoordinates = () => {
		setFormValues({
			...formValues,
			radius: 0,
		});

		if (!selectedWall) return;

		// selectedWall.path[1][1] = selectedWall.getCenterPoint().x!;
		// selectedWall.path[1][2] = selectedWall.getCenterPoint().y!;
	};

	useEffect(() => {
		handleRadius();
	}, [formValues]);

	useEffect(() => {
		if (selectedWall) {
			addCoordinates();
		}
	}, [selectedWall]);

	useEffect(() => {}, [points]);

	return (
		<div>
			<h1 className="title">Tooltip</h1>
			{selectedWall && (
				<form
					className="canvasForm"
					onClick={(e) => e.preventDefault()}
				>
					<p className="subtitle">Wall Options</p>
					<button
						className="canvasForm__button canvasForm__button--delete"
						onClick={handleRemoveWall}
					>
						Eliminar
					</button>
					<button
						className="canvasForm__button canvasForm__button--new"
						onClick={handleAddPoint}
					>
						Nuevo Punto
					</button>
					{/* <div className="canvasForm__field">
						<label htmlFor="radiusX">Radius en el eje X</label>
						<input
							className="canvasForm__input"
							type="number"
							placeholder="Curvatura"
							onChange={handleChange}
							name="radiusX"
							value={formValues.radiusX}
						/>
					</div>

					<div className="canvasForm__field">
						<label htmlFor="radiusY">Radius en Y</label>
						<input
							className="canvasForm__input"
							type="number"
							placeholder="Curvatura"
							onChange={handleChange}
							name="radiusY"
							value={formValues.radiusY}
						/>
					</div> */}
					<div className="canvasForm__field">
						<label htmlFor="radius">Radius</label>
						<input
							className="canvasForm__input"
							type="text"
							placeholder="Curvatura"
							onChange={handleChange}
							name="radius"
							value={formValues.radius}
						/>
					</div>
				</form>
			)}
		</div>
	);
};

export default Form;
