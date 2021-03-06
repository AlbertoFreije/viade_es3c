import React from "react";
import { render, cleanup, queryByAttribute, fireEvent } from "react-testing-library";
import { HashRouter as Router } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import UploadRoute from "../UploadRoute";
import * as Toaster from "../../../utils/toaster";
import { configure } from "enzyme";
import { getByTestId } from "@testing-library/dom";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

library.add(fas);

const props = {
	webId: "https://saragarcia.solid.community/"
};

describe.only("NewRoute", () => {
	afterAll(cleanup);

	const { container } = render(
		<Router>
			<UploadRoute {...{ ...props }} />
		</Router>
	);

	test("renders without crashing", async () => {
		expect(container).toBeTruthy();
	});

	test("Trying to upload a Route with geojson", () => {
		const nameInput = getByTestId(container, "route_name");
		const descriptionInput = getByTestId(container, "route_description");
		const button_save = getByTestId(container, "bt-save");

		fireEvent.change(nameInput, { target: { value: "prueba" } });
		fireEvent.change(descriptionInput, { target: { value: "esto es una prueba" } });

		expect(nameInput.value).toEqual("prueba");
		expect(descriptionInput.value).toEqual("esto es una prueba");

		const getById = queryByAttribute.bind(null, "id");
		const input_img = getById(container, "input-img");

		const img = new File([ "(⌐□_□)" ], "img.png", {
			type: "image/png"
		});

		const fileInput = getByTestId(container, "file-input");
		const geojson =
			'{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"type": "LineString","coordinates": [[28.10302734375,52.81604319154934],[27.83935546875,50.12057809796008],[29.860839843749996,49.296471602658066],[29.5751953125,51.876490970614775],[31.904296874999996,51.16556659836182],[31.3330078125,49.710272582105695]]}}]}';
		const file = new File([ geojson ], "prueba.geojson");

		Object.defineProperty(fileInput, "files", { value: [ file ] });
		fireEvent.change(fileInput);
		Object.defineProperty(container, "file", { value: file });
		fireEvent.change(container);

		fireEvent.click(button_save);
	});
});
