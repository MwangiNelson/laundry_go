import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type BranchInvitationEmailProps = {
  actionLink: string;
  parentBusinessName: string;
  branchName: string;
  appUrl?: string;
  year?: number;
};

export const BranchInvitationEmail = ({
  actionLink,
  parentBusinessName,
  branchName,
  appUrl = "https://laundrygo.app",
  year = new Date().getFullYear(),
}: BranchInvitationEmailProps) => {
  const previewText = `You've been invited to manage ${branchName} on LaundryGo`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#0f172a",
          margin: "auto",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <Container
          style={{
            marginBottom: "40px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "20px",
            maxWidth: "580px",
          }}
        >
          <Heading
            style={{
              fontSize: "28px",
              color: "#ffffff",
              fontWeight: "600",
              textAlign: "center",
              margin: "40px 0 0 0",
            }}
          >
            You&rsquo;re Invited to{" "}
            <span style={{ color: "#F5C555" }}>LaundryGo</span>!
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#94a3b8",
              textAlign: "center",
              margin: "12px 0 32px 0",
            }}
          >
            {parentBusinessName} has invited you to manage a branch.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              color: "#e2e8f0",
              lineHeight: "24px",
              margin: "0 0 16px 0",
            }}
          >
            Hello,
          </Text>

          <Text
            style={{
              fontSize: "15px",
              color: "#cbd5e1",
              lineHeight: "24px",
              margin: "0 0 16px 0",
            }}
          >
            You&rsquo;ve been invited by{" "}
            <strong style={{ color: "#e2e8f0" }}>{parentBusinessName}</strong> to
            set up and manage the{" "}
            <strong style={{ color: "#F5C555" }}>{branchName}</strong> branch on
            LaundryGo.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              color: "#cbd5e1",
              lineHeight: "24px",
              margin: "0 0 32px 0",
            }}
          >
            Click the button below to accept the invitation and complete your
            branch setup. You&rsquo;ll need to configure your services, operating
            hours, and payment details.
          </Text>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={actionLink}
              style={{
                padding: "14px 32px",
                backgroundColor: "#F5C555",
                borderRadius: "8px",
                color: "#0f172a",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
              }}
            >
              Accept Invitation
            </Button>
          </Section>

          <Text
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: "20px",
              margin: "32px 0 8px 0",
            }}
          >
            If the button doesn&rsquo;t work, copy and paste this link into your
            browser:
          </Text>

          <Text
            style={{
              fontSize: "13px",
              color: "#60a5fa",
              lineHeight: "20px",
              margin: "0 0 32px 0",
              wordBreak: "break-all",
            }}
          >
            {actionLink}
          </Text>

          <div
            style={{
              borderTop: "1px solid #334155",
              margin: "40px 0",
              paddingTop: "32px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                lineHeight: "22px",
                margin: "0 0 24px 0",
              }}
            >
              If you weren&rsquo;t expecting this invitation, you can safely
              ignore this email.
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#cbd5e1",
                lineHeight: "22px",
                margin: "0",
              }}
            >
              Cheers,
              <br />
              The LaundryGo Team
            </Text>
          </div>

          <Section
            style={{
              textAlign: "center",
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #334155",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: "0",
              }}
            >
              &copy; {year} LaundryGo &bull; {appUrl}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BranchInvitationEmail;
