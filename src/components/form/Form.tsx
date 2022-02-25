import { ChangeEvent, useEffect, useState } from "react";
import { makePath } from "../../helpers/canvasHelper";
import { addPoint, removePaths } from "../../helpers/tooltipHelper";
import { useAppDispatch, useAppSelector } from "../../state/hook";

type TFormValues = {
	radiusX: number;
	radiusY: number;
};

const Form = () => {
	const {
		canvasRef: canvas,
		selectedWall,
		points,
	} = useAppSelector((state) => state.canvas);
	const dispatch = useAppDispatch();

	const [formValues, setFormValues] = useState<TFormValues>({
		radiusX: 0,
		radiusY: 0,
	});

	const handleRadius = () => {
		// Las horizontales van en eje x de 250 y verticales en y, no obstante, las poligonales tienen tener números iguales en ambos ejes y su mitad es 250
		if (!selectedWall) return;
		const fabricPath: fabric.Path = makePath({
			x1: selectedWall.path[0][1],
			y1: selectedWall.path[0][2],
			x2: selectedWall.path[1][3],
			y2: selectedWall.path[1][4],
			curveX: formValues.radiusX,
			curveY: formValues.radiusY,
		});

		selectedWall.set({ path: fabricPath.path, padding: 100 });

		canvas?.renderAll();
	};

	const handleAddPoint = () => {
		if(!canvas || !selectedWall) return
		addPoint(canvas, points, selectedWall, dispatch);
	}

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
			radiusX: selectedWall?.path[1][1] || 0,
			radiusY: selectedWall?.path[1][2] || 0,
		});
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
					<div className="canvasForm__field">
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
					</div>
				</form>
			)}
		</div>
	);
};

export default Form;
