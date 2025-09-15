"use client";

import { Box, Button, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUpload, FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import "./global.css";
import ProtectedRoute from "@/features/ProtectedRoute/ui/ProtectedRoute";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <FiUpload color="#0DE6BE" size={30} />,
      title: "Загрузка документов",
      description: "Загружайте PDF файлы и получайте мгновенный предпросмотр содержимого",
      route: "/upload",
    },
    {
      icon: <FiSearch color="#0DE6BE" size={30} />,
      title: "Поиск по документам",
      description: "Находите нужную информацию с помощью умного поиска по смыслу и ключевым словам",
      route: "/search",
    },
    {
      icon: <GoHistory color="#0DE6BE" size={30} />,
      title: "История запросов",
      description: "Просматривайте все ваши предыдущие поисковые запросы и результаты",
      route: "/history",
    },
  ];

  return (
    <ProtectedRoute>
      <Grid2
        container
        size="grow"
        flexDirection={"column"}
        alignItems={"center"}
        sx={{
          backgroundColor: "background",
          p: 2,
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: "20px",
            backgroundColor: "background.paper",
            maxWidth: "900px",
            width: "100%",
            textAlign: "center",
            userSelect: "none",
            boxShadow: 2,
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === "dark" ? "#0DE6BE" : "#00bfae",
              mb: 2,
            }}
          >
            Интелектуальный текстовый агент — МАФ
          </Typography>
          <Typography
            variant="body1"
            component="h2"
            sx={{
              color: "text.primary",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            }}
          >
            Загружайте документы и получайте ответы на ваши вопросы от ИИ-ассистента.
            <br />
            Ищите информацию по смыслу, а не только по точным словам. <br />
            Все ответы основаны на содержимом ваших загруженных документов.
          </Typography>
        </Box>

        <Grid2
          mt={9}
          gap={9}
          sx={{
            width: "85vw",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={feature.title}
              onClick={() => router.push(feature.route)}
              sx={{
                backgroundColor: "background.paper",
                p: 3,
                borderRadius: "20px",
                cursor: "pointer",
                minWidth: "22%",
                maxWidth: "22%",
                opacity: 0,
                transform: "translateY(40px) scale(0.9)",
                animationName: "fadeInUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
                animationDelay: `${index * 0.4}s`,
                transition:
                  "box-shadow 0.3s cubic-bezier(.4,2,.6,1), transform 0.3s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-8px) scale(1.03)",
                },
              }}
            >
              {feature.icon}
              <Typography mt={3} variant="h5">
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ width: "100%", mt: 2 }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Grid2>

        <Button
          variant="contained"
          sx={{
            mt: "10vh",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#0DE6BE",
            },
          }}
          onClick={() => router.push("/upload")}
        >
          <Typography p={1}>Загрузить книги</Typography>
          <FaArrowRightLong />
        </Button>
      </Grid2>
    </ProtectedRoute>
  );
}
