import { Card } from "./card";

type CodePreviewProps = {
  title: string;
  language: string;
  code: string;
};

export function CodePreview({ title, language, code }: CodePreviewProps) {
  return (
    <Card className="code-preview-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Kod önizleme</p>
          <h3>{title}</h3>
        </div>
        <span className="chip">{language}</span>
      </div>

      <pre className="code-preview-block">
        <code>{code}</code>
      </pre>
    </Card>
  );
}