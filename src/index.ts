import fs from "fs";

enum WantTo {
    TABLE,
    RELATIONS,
}
type ValueType<T> = Record<string, T>;
type OptionsTo = { to: string };

interface SaveOptions {
    indent?: number;
}

class RelatedJSON {
    private connectPathInfo: OptionsTo = { to: "" };
    private models: Record<string, any> = {};
    private relations: (typeof this.models)[] = [];

    connect(options: OptionsTo) {
        if (!options.to) console.error("path not found");
        if (options.to === this.connectPathInfo.to) {
            console.error("already connected, might be disconnect to solve error.");
        }
        this.connectPathInfo = options;
    }

    disconnect() {
        if (!this.connectPathInfo.to) console.error("path not found");
        this.connectPathInfo.to = "";
    }

    create<U>(wantTo: WantTo, modelName: string, inner_value: ValueType<U>) {
        switch (wantTo) {
            case WantTo.TABLE:
                this.models[modelName] = inner_value;
                break;
            case WantTo.RELATIONS:
                this.relations.push(inner_value);
                break;
        }
    }

    save(options?: SaveOptions) {
        if (!this.connectPathInfo.to) {
            console.error("path not found");
            return;
        }

        try {
            const fullData = {
                models: this.models,
                relations: this.relations,
            };

            fs.writeFileSync(
                this.connectPathInfo.to,
                JSON.stringify(fullData, null, options?.indent ?? 4),
                "utf-8"
            );
        } catch (e) {
            console.error(e);
        }
    }

    load() {
        if (!this.connectPathInfo.to) {
            console.error("path not found");
        }

        const main = fs.readFileSync(this.connectPathInfo.to, "utf-8");
        const data = JSON.parse(main);

        this.models = typeof data.models === 'object' && data.models !== null ? data.models : {};
        this.relations = Array.isArray(data.relations) ? data.relations : [];
    }
}

export default RelatedJSON;
