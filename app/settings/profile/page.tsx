import ContentSection from "../components/content-section";
import ProfileForm from "./profile-form";

export default function Page() {
  return (
    <ContentSection
      title="Thông tin cá nhân"
      desc=""
    >
      <ProfileForm />
    </ContentSection>
  );
}
