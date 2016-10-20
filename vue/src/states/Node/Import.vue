<template>
	<div id="node-import">

		<section class="file-picker">

			<div v-show="!file">
				<h1>Selecciona o arrastra un archivo CSV</h1>
				<input type="file" @change="fileChanged($event)" />
			</div>
			<a v-show="file" @click="file = null">
				<i class="fa fa-times"></i>
				<span>cambiar archivo</span>
			</a>

		</section>

		<section class="file-preview" v-show="filePreview.length > 0">

			<input type="checkbox" v-model="ignoreFirstLine" id="ignoreFirstLine">
			<label for="ignoreFirstLine">ignorar primera linea</label>

			<table cellspacing="0" cellpadding="0" border="0">
				<thead v-show="ignoreFirstLine">
					<tr>
						<td @click="selectColumn(key)" v-for="(columnName, key) in fileColumns" v-text="columnName"></td>
					</tr>
				</thead>
				<tbody>
					<tr v-show="!ignoreFirstLine">
						<td @click="selectColumn(key)" v-for="(columnName, key) in fileColumns" v-text="columnName"></td>
					</tr>
					<tr v-for="line in filePreview">
						<td @click="selectColumn(key)" v-for="(cell, key) in line" v-text="cell"></td>
					</tr>
				</tbody>
			</table>

		</section>

		<section class="map" v-if="fileColumns.length">

			<div class="person">
				<h1>Persona</h1>
				<ul>
					<li v-for="(attribute, attributeName) in map.person.attributes">
						<label v-text="attribute.label" @click="selectedAttribute = attribute"></label>
						<select @change="setAttributeSource(attribute, $event.target.value)" v-show="attribute.source != 'value'">
							<option value="">---</option>
							<option value="value" :selected="attribute.source == 'value'">valor</option>
							<option v-for="(columnName, key) in fileColumns" :value="key" :selected="attribute.source == 'column' && attribute.value == key">columna {{key+1}}: {{columnName}}</option>
						</select>
						<div class="value-picker" v-show="attribute.source == 'value'">
							<input type="text" v-model="attribute.value" />
							<i class="fa fa-times" @click="setAttributeSource(attribute, null)"></i>
						</div>
					</li>
				</ul>
			</div>

			<div class="relatives">
				<h1>Familiares</h1>

				<ul v-for="relative in map.relatives">

					<li>
						<label>Parentesco</label>
						<select v-model="relative.role">
							<option value="padre">padre/madre</option>
							<option value="tio">tio/tia</option>
							<option value="acudiente">acudiente</option>
						</select>
					</li>

					<li v-for="(attribute, attributeName) in relative.attributes">
						<label v-text="attribute.label" @click="selectedAttribute = attribute"></label>
						<select @change="setAttributeSource(attribute, $event.target.value)" v-show="attribute.source != 'value'">
							<option value="">---</option>
							<option value="value" :selected="attribute.source == 'value'">valor</option>
							<option v-for="(columnName, key) in fileColumns" :value="key" :selected="attribute.source == 'column' && attribute.value == key">columna {{key+1}}: {{columnName}}</option>
						</select>
						<div class="value-picker" v-show="attribute.source == 'value'">
							<input type="text" v-model="attribute.value" />
							<i class="fa fa-times" @click="setAttributeSource(attribute, null)"></i>
						</div>
					</li>
				</ul>

				<button class="phi-button adder" @click="addRelative()">Agregar familiar</button>

			</div>

			<div class="groups">
				<h1>Inscripción</h1>

				<ul v-for="group in map.groups">
					<li v-for="(attribute, attributeName) in group.attributes">
						<label v-text="attribute.label" @click="selectedAttribute = attribute"></label>
						<select @change="setAttributeSource(attribute, $event.target.value)" v-show="attribute.source != 'value'">
							<option value="">---</option>
							<option value="value" :selected="attribute.source == 'value'">valor</option>
							<option v-for="(columnName, key) in fileColumns" :value="key" :selected="attribute.source == 'column' && attribute.value == key">columna {{key+1}}: {{columnName}}</option>
						</select>
						<div class="value-picker" v-show="attribute.source == 'value'">
							<input type="text" v-model="attribute.value" />
							<i class="fa fa-times" @click="setAttributeSource(attribute, null)"></i>
						</div>
					</li>
				</ul>

				<button class="phi-button adder" @click="addGroup()">Crear subgrupo</button>

			</div>
		</section>

		<footer v-show="fileColumns.length > 0">
			<button class="phi-button" @click="upload()" v-show="!uploading">subir datos</button>
			<p v-show="uploading">importando datos (esta operación puede tardar varios minutos)</p>
		</footer>

	</div>
</template>

<script>
import app from '../../store/app.js';

export default {
	name: "node-import",

	data () {
		return {
			nodeId: this.$route.params.nodeId,
			file: null,

			uploading: false,

			filePreview: [],
			fileColumns: [],
			ignoreFirstLine: true,

			levels: [],
			map: {
				person: {
					id: "person",
					attributes: {
						document:     {label: "documento",         source: null, value: null},
						documentType: {label: "tipo de documento", source: null, value: null},
						firstName:    {label: "nombre",            source: null, value: null},
						lastName:     {label: "apellido",          source: null, value: null},
						lastName2:    {label: "segundo apellido",  source: null, value: null},
						email:        {label: "email",             source: null, value: null},
						gender:       {label: "género",            source: null, value: null},
						birthDay:     {label: "cumpleaños",        source: null, value: null},
						mobile:       {label: "móvil",             source: null, value: null}
					}
				},

				relatives: [],
				groups: []
			},

			selectedAttribute: null
		}
	},

	methods: {

		addRelative () {
			this.map.relatives.push({
				id: "relative_" + (this.map.relatives.length + 1),
				role: null,
				attributes: {
					document:     {label: "documento",         source: null, value: null},
					documentType: {label: "tipo de documento", source: null, value: null},
					firstName:    {label: "nombre",            source: null, value: null},
					lastName:     {label: "apellido",          source: null, value: null},
					lastName2:    {label: "segundo apellido",  source: null, value: null},
					email:        {label: "email",             source: null, value: null},
					gender:       {label: "género",            source: null, value: null},
					birthDay:     {label: "cumpleaños",        source: null, value: null},
					mobile:       {label: "móvil",             source: null, value: null}
				}
			});
		},

		addGroup () {
			this.map.groups.push({
				id: "group_" + (this.map.groups.length + 1),
				attributes: {
					type: {label: "tipo",   source: null, value: null},
					name: {label: "nombre", source: null, value: null}
				}
			});
		},

		selectColumn (index) {
			if (!this.selectedAttribute) {
				return;
			}
			this.setAttributeSource(this.selectedAttribute, index);
		},

		upload () {
			var formData = new FormData();
			formData.append("file", this.file);

			var map    = Object.assign({}, this.map);
			map.levels = this.levels;
			formData.append("map", JSON.stringify(map));

			this.uploading = true;

			app.api.post(`nodes/${this.nodeId}/import?skip=${this.ignoreFirstLine ? 1 : 0}`, formData)
				.then(response => {
					this.uploading = false;
					console.log("upload responded with:", response);
				}, error => {
					this.uploading = false;
					console.log("upload error", error);
				});
		},

		setAttributeSource (attribute, source) {
			if (source === "") {
				attribute.source = null;
				attribute.value  = null;
				return;
			}

			if (source == "value") {
				attribute.source = "value";
				attribute.value  = null;
			} else {
				attribute.source = "column";
				attribute.value  = source;
			}
		},

		fileChanged (event) {
			this.file = event.target.files[0];
			this.readFile(this.file);
		},

		readFile (file) {

			var reader = new FileReader();

			reader.onload = (e) => {

				var data  = e.target.result;
				var lines = data.split("\n");

				this.fileColumns = lines.shift().split(",");
				this.filePreview = [];

				for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
					var cells = lines[lineIndex].split(",");
					if (cells.length == this.fileColumns.length) {
						this.filePreview.push(cells);
					}
				}
			};

			reader.readAsText(file.slice(0, 512));
		}
	}
}
</script>

<style scoped lang="sass">

[phi-layout="row"] {
	display: flex;
	& > * {
		flex: 1;
	}
}

.file-picker {

	h1 {
		font-size: 1.3em;
		margin-bottom: 12px;
		color: #333;
	}

	input {
		background: rgba(0, 0, 0, 0.1);
		padding: 24px 32px;
		display: block;
		width: 100%;
		border-radius: 4px;
	}
}

.file-preview {

	margin: 16px 0;

	table {
		width: 100%;
		margin-top: 12px;
		border-collapse: collapse;

		td {
			padding: 3px;
		}

		thead {
			td {
				font-weight: 500;
			}
		}

		tbody {
			background: #fff;
			td {
				border: 1px solid #ccc;
			}
		}
	}

}

footer {
	margin-top: 24px;
	display: flex;

	& > * {
		flex: 1;
		text-align: center;
	}
}

.map {
	list-style: none;
	margin: 0;
	padding: 0;
	margin-top: 24px;

	display: flex;

	& > div {
		flex: 1;
		margin: 4px 12px;

		h1 {
			color: #333;
			font-size: 1.2em;
			margin-bottom: 6px;
		}
	}


	ul {
		list-style: none;
		margin: 0 0 16px 0;
		padding: 12px;
		background-color: #fff;
		border-radius: 4px;

		& > li {
			padding: 4px;
			display: flex;

			& > * {
				flex: 1;
			}

			label {
				text-align: right;
				margin: 4px;
				margin-right: 16px;
				max-width: 33%;
			}

			select {
				border: 0;
				background: transparent;
				font-size: 0.9em;
				cursor: pointer;
			}

			.value-picker {
				display: flex;
				align-items: center;

				input {
					flex: 1;
				}

				i {
					margin-left: 6px;
				}
			}

		}


	}

}


</style>