import { Card } from "./card";

type MediaUploadShellProps = {
  title: string;
  description: string;
};

export function MediaUploadShell({ title, description }: MediaUploadShellProps) {
  return (
    <Card className="media-shell-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Medya yukleme kabugu</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="media-shell-dropzone">
        <strong>Dosyayi surukle veya sec</strong>
        <p>{description}</p>
      </div>
    </Card>
  );
}