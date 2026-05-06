const base = "http://127.0.0.1:3000/api/assessment-document?assessmentId=emergency-save-race&taskId=1&studentId=111";
const headers = {
  "content-type": "application/json",
  "x-osteps-role": "STUDENT",
  "x-osteps-student-id": "111",
};
const annotation = {
  id: "a",
  type: "text",
  page: 1,
  x: 1,
  y: 2,
  text: "saved",
  color: "#111",
  fontSize: 16,
};

async function post(seq, annotations) {
  const res = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      layer: "student",
      annotations,
      metadata: { clientSaveId: "race-test", clientSaveSeq: seq },
    }),
  });
  return { status: res.status, body: await res.json() };
}

(async () => {
  console.log("newer", JSON.stringify(await post(2, [annotation])));
  console.log("older", JSON.stringify(await post(1, [])));
  const final = await (await fetch(base, { headers })).json();
  console.log(
    "final",
    JSON.stringify({
      count: final.studentAnnotations.length,
      text: final.studentAnnotations[0]?.text,
      seq: final.metadata?.clientSaveSeq,
    })
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
