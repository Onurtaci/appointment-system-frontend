import { Box, Container, Paper, Typography, useTheme } from "@mui/material";
import React from "react";

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('/pattern.svg')",
          opacity: 0.1,
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%)",
          zIndex: 0,
        },
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
            maxWidth: 500,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.primary.main,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 3,
              textAlign: "center",
              maxWidth: "80%",
              mx: "auto",
            }}
          >
            {subtitle}
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
