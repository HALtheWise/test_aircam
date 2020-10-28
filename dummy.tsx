import * as React from "react";
import * as ReactDOM from "react-dom";

import { IdGroupView, CropDescriptor } from "./id_group_view";

type CropMap = Map<string, Array<CropDescriptor>>;
type AppViewProps = {};

interface AppViewState {
    cropMap: CropMap;
}

class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props: AppViewProps) {
        super(props);
        this.state = {
            cropMap: new Map()
        };
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const cropMapData = JSON.parse(xhr.responseText);
                const cropMap: CropMap = new Map();
                Object.keys(cropMapData).forEach(identifier => {
                    cropMap.set(identifier, cropMapData[identifier]["crops"]);
                });
                this.setState({ cropMap });
            }
        };
        xhr.open("GET", "/crop-map", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(null);
    }

    render() {
        return (
            <div>
                {Array.from(this.state.cropMap.entries()).map(([identifier, crops]) => {
                    return <IdGroupView identifier={identifier} crops={crops} />;
                })}
            </div>
        );
    }

    static create() {
        const container = document.getElementById("app");
        ReactDOM.render(<AppView />, container);
    }
}

AppView.create();

