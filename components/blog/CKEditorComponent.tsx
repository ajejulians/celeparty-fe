"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
	Bold,
	ClassicEditor,
	Essentials,
	Heading,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	Table,
	Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

interface CKEditorComponentProps {
	value: string;
	onChange: (value: string) => void;
}

export default function CKEditorComponent({
	value,
	onChange,
}: CKEditorComponentProps) {
	return (
		<div className="border border-neutral-200 rounded-lg overflow-hidden prose-custom max-w-none">
			<CKEditor
				editor={ClassicEditor}
				config={{
					licenseKey: "GPL",
					plugins: [
						Essentials,
						Bold,
						Italic,
						Heading,
						Indent,
						IndentBlock,
						Link,
						List,
						MediaEmbed,
						Paragraph,
						Table,
						Undo,
					],
					toolbar: [
						"heading",
						"|",
						"bold",
						"italic",
						"link",
						"bulletedList",
						"numberedList",
						"|",
						"outdent",
						"indent",
						"|",
						"insertTable",
						"mediaEmbed",
						"undo",
						"redo",
					],
				}}
				data={value}
				onChange={(_event, editor) => {
					const data = editor.getData();
					onChange(data);
				}}
			/>
		</div>
	);
}
