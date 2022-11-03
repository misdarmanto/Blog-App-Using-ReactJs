import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function SkeletonCard() {
  return (
    <Stack spacing={1} mb={7}>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack>
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="text" width={100} height={15} />
          </Stack>
        </Stack>
        <Skeleton variant="rectangular" height={30} width={50} />
      </Stack>

      <Skeleton variant="rectangular" height={150} />
      <Skeleton variant="text" height={35} width={150} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Stack direction="row" alignItems="center" spacing={2} mt={5}>
        <Skeleton variant="rectangular" height={30} width={50} />
        <Skeleton variant="rectangular" height={30} width={50} />
        <Skeleton variant="rectangular" height={30} width={50} />
      </Stack>
    </Stack>
  );
}
