import { Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

export const AppointmentListSkeleton = () => (
  <Stack spacing={2}>
    {[1, 2, 3].map((i) => (
      <Card key={i} sx={{ opacity: 0.7 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="80%" height={20} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={32}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ))}
  </Stack>
);
