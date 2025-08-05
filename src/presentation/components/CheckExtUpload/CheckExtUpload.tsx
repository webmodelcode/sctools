import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

export const CheckExtUpload = () => {
  const [isUploadAvailable, setIsUploadAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState("0.0.0");
  const [downloadUrl, setDownloadUrl] = useState("");

  browser.runtime.sendMessage(
    {
      type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHECK_EXT_UPLOAD,
    },
    (response) => {
      if (response) {
        setLatestVersion(response.latestVersion);
        setDownloadUrl(response.downloadUrl);
        setIsUploadAvailable(true);
        return;
      }
    },
  );

  if (!isUploadAvailable) return;

  return (
    <div>
      <a href={downloadUrl} target="_blank" rel="noreferrer">
        Download
      </a>
    </div>
  );
};
