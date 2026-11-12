import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btnClass = (active) => `
    p-2 rounded-md transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-[#F7B115] text-white shadow-sm"
        : "hover:bg-gray-100 text-gray-600"
    }
  `;

  const Divider = () => (
    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white sticky top-0 z-10">
      {/* History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnClass()} disabled:opacity-30 disabled:cursor-not-allowed`}
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnClass()} disabled:opacity-30 disabled:cursor-not-allowed`}
        title="Redo"
      >
        <Redo size={18} />
      </button>
      <Divider />

      {/* Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive("code"))}
        title="Code"
      >
        <Code size={18} />
      </button>
      <Divider />

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>
      <Divider />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>
      <Divider />

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btnClass(editor.isActive({ textAlign: "left" }))}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={btnClass(editor.isActive({ textAlign: "right" }))}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>
      <Divider />

      {/* Misc */}
      <button
        type="button"
        onClick={setLink}
        className={btnClass(editor.isActive("link"))}
        title="Link"
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>
    </div>
  );
};

export const TextEditor = ({
  content = "",
  onChange,
  placeholder = "Type your content here...",
  minHeight = "350px",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#F7B115] underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none p-6 text-slate-800 text-sm leading-relaxed",
        style: `min-height: ${minHeight};`,
      },
    },
  });

  // Keep content in sync if changed from outside (e.g. data loaded from API)
  // CRITICAL: Do NOT overwrite content while editor is focused (typing), to avoid cursor jumping
  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    const isCurrentEmpty =
      editor.isEmpty || currentHTML === "<p></p>" || currentHTML === "";
    const isNewEmpty = !content || content === "<p></p>" || content === "";

    if (isCurrentEmpty && isNewEmpty) {
      return;
    }

    if (currentHTML !== content && !editor.isFocused) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const getWordCount = () => {
    if (!editor) return 0;
    const text = editor.getText().trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="w-full border rounded-xl shadow-sm bg-white overflow-hidden border-gray-200 focus-within:ring-2 focus-within:ring-amber-200 focus-within:border-[#F7B115] transition-all">
      <MenuBar editor={editor} />
      <div
        className="max-h-[600px] overflow-y-auto relative cursor-text"
        style={{ minHeight }}
        onClick={() => editor?.commands.focus()}
      >
        {editor && editor.isEmpty && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none text-sm">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-2 border-t bg-gray-50 text-[11px] text-gray-500 flex justify-between select-none">
        <span>Rich Text Editor</span>
        <span>{getWordCount()} words</span>
      </div>
    </div>
  );
};

export default TextEditor;