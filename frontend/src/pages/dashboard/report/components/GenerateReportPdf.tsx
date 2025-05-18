import { logoBase64 } from "@/assets/logobase64";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1 solid #333",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: {
    flex: 1,
    gap: 5,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#353232",
  },
  section: {
    marginBottom: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#eeeeee",
    padding: 12,
    borderRadius: 6,
    width: "45%",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 10,
    color: "#444",
  },
  cardValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
});

const GlucoseReportPDF = ({ data }: { data: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Glucose Report</Text>
              <Text style={styles.subtitle}>
                Patient: {data.patientName || "--"}
              </Text>
              <Text style={styles.subtitle}>
                Type: {data.diabetesType || "--"} | Gender:{" "}
                {data.gender || "--"} | Age: {data.age || "--"}
              </Text>
              <Text style={styles.subtitle}>Date Range: {data.range}</Text>
              <Text style={styles.subtitle}>
                Date Generated:{" "}
                {format(new Date(data.generatedDate), "MMMM d yyyy")}
              </Text>
            </View>

            <Image style={styles.logo} src={logoBase64} />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Average</Text>
              <Text style={styles.cardValue}>
                {data.avgGlucose || "--"} {data.avgGlucose ? data.unit : ""}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Time in Range</Text>
              <Text style={styles.cardValue}>{data.timeInRange}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Lows</Text>
              <Text style={styles.cardValue}>{data.totalLows}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Highs</Text>
              <Text style={styles.cardValue}>{data.totalHighs}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Est. HbA1C</Text>
              <Text style={styles.cardValue}>{data.a1c}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Readings</Text>
              <Text style={styles.cardValue}>{data.readings}</Text>
            </View>
          </View>
        </View>

        {/* Meal Timing Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Timing Summary</Text>
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Before Meals</Text>
              <Text style={styles.cardValue}>
                {data.beforeMeals || "--"} {data.beforeMeals ? data.unit : ""}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>After Meals</Text>
              <Text style={styles.cardValue}>
                {data.afterMeals || "--"} {data.afterMeals ? data.unit : ""}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Fasting</Text>
              <Text style={styles.cardValue}>
                {data.fasting || "--"} {data.fasting ? data.unit : ""}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Most Highs</Text>
              <Text style={styles.cardValue}>
                {data.mostHighMealTime || "--"}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Most Lows</Text>
              <Text style={styles.cardValue}>
                {data.mostLowMealTime || "--"}{" "}
              </Text>
            </View>
          </View>
        </View>

        {/* You can add "Weekly Logging Summary", chart placeholders, etc., the same way */}
      </Page>
    </Document>
  );
};

export default GlucoseReportPDF;
