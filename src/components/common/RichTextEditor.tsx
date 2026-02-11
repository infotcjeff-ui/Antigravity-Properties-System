'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-xl" />,
});

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'clean'],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link',
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="rich-text-editor">
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    border-bottom-left-radius: 0.75rem;
                    border-bottom-right-radius: 0.75rem;
                    background: transparent;
                    border: 1px solid rgba(228, 228, 231, 1);
                    min-height: 150px;
                    font-size: 0.875rem;
                }
                .dark .rich-text-editor .ql-container {
                    border-color: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 0.75rem;
                    border-top-right-radius: 0.75rem;
                    background: rgba(244, 244, 245, 1);
                    border: 1px solid rgba(228, 228, 231, 1);
                    border-bottom: none;
                }
                .dark .rich-text-editor .ql-toolbar {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .dark .rich-text-editor .ql-toolbar .ql-stroke {
                    stroke: rgba(255, 255, 255, 0.6);
                }
                .dark .rich-text-editor .ql-toolbar .ql-fill {
                    fill: rgba(255, 255, 255, 0.6);
                }
                .dark .rich-text-editor .ql-toolbar .ql-picker {
                    color: rgba(255, 255, 255, 0.6);
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: rgba(161, 161, 170, 1);
                    font-style: normal;
                }
                .dark .rich-text-editor .ql-editor.ql-blank::before {
                    color: rgba(255, 255, 255, 0.3);
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}
