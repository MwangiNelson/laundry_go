import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type ConfirmationEmailProps = {
  actionLink: string;
  appUrl?: string;
  year?: number;
};

export const ConfirmationEmail = ({
  actionLink,
  appUrl = "https://laundrygo.app",
  year = new Date().getFullYear(),
}: ConfirmationEmailProps) => {
  const previewText = "Verify your LaundryGo email address";

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
            Welcome to <span style={{ color: "#F5C555" }}>LaundryGo</span>!
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#94a3b8",
              textAlign: "center",
              margin: "12px 0 32px 0",
            }}
          >
            Verify your email to finish setting up your account.
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
              margin: "0 0 32px 0",
            }}
          >
            Thanks for joining LaundryGo. Click the button below to verify your
            email address and get started with our laundry services.
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
              Verify Email Address
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
            If the button doesn't work, copy and paste this link into your
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
              If you didn't create an account with LaundryGo, you can safely
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

export default ConfirmationEmail;
