import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  children: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'plaintext' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/75 text-gray-300 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <div className="rounded-lg overflow-hidden">
        <Highlight
          theme={themes.nightOwl}
          code={children.trim()}
          language={language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="p-4 bg-[#011627] overflow-x-auto" style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

// Removed unused component: CodeBlockSimple

export default CodeBlock;