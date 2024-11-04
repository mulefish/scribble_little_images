import pandas as pd
import matplotlib.pyplot as plt
japanese_color = "brown"
usa_color="blue"
# Japanese Prime Ministers Data
japan_pm_data = [
    {"Name": "Eisaku Satō", "Start": 1964, "End": 1972, "Social Liberalism": 40, "Fiscal Conservatism": 70, "Economic Growth": 7.0},
    {"Name": "Kakuei Tanaka", "Start": 1972, "End": 1974, "Social Liberalism": 50, "Fiscal Conservatism": 65, "Economic Growth": 5.0},
    {"Name": "Takeo Miki", "Start": 1974, "End": 1976, "Social Liberalism": 55, "Fiscal Conservatism": 60, "Economic Growth": 3.0},
    {"Name": "Takeo Fukuda", "Start": 1976, "End": 1978, "Social Liberalism": 45, "Fiscal Conservatism": 75, "Economic Growth": 4.0},
    {"Name": "Masayoshi Ōhira", "Start": 1978, "End": 1980, "Social Liberalism": 50, "Fiscal Conservatism": 70, "Economic Growth": 4.5},
    {"Name": "Yasuhiro Nakasone", "Start": 1982, "End": 1987, "Social Liberalism": 40, "Fiscal Conservatism": 80, "Economic Growth": 5.0},
    {"Name": "Shinzō Abe (2nd Term)", "Start": 2012, "End": 2020, "Social Liberalism": 55, "Fiscal Conservatism": 75, "Economic Growth": 1.5},
    {"Name": "Yoshihide Suga", "Start": 2020, "End": 2021, "Social Liberalism": 60, "Fiscal Conservatism": 70, "Economic Growth": -4.0},
    {"Name": "Fumio Kishida", "Start": 2021, "End": None, "Social Liberalism": 65, "Fiscal Conservatism": 65, "Economic Growth": None}
]

# American Presidents Data
us_presidents_data = [
    {"Name": "Richard Nixon", "Start": 1969, "End": 1974, "Social Liberalism": 40, "Fiscal Conservatism": 70, "Economic Growth": 2.5},
    {"Name": "Gerald Ford", "Start": 1974, "End": 1977, "Social Liberalism": 45, "Fiscal Conservatism": 65, "Economic Growth": -0.5},
    {"Name": "Jimmy Carter", "Start": 1977, "End": 1981, "Social Liberalism": 60, "Fiscal Conservatism": 55, "Economic Growth": 3.0},
    {"Name": "Ronald Reagan", "Start": 1981, "End": 1989, "Social Liberalism": 35, "Fiscal Conservatism": 85, "Economic Growth": 3.5},
    {"Name": "George H.W. Bush", "Start": 1989, "End": 1993, "Social Liberalism": 40, "Fiscal Conservatism": 80, "Economic Growth": 2.0},
    {"Name": "Bill Clinton", "Start": 1993, "End": 2001, "Social Liberalism": 70, "Fiscal Conservatism": 65, "Economic Growth": 4.0},
    {"Name": "Barack Obama", "Start": 2009, "End": 2017, "Social Liberalism": 75, "Fiscal Conservatism": 60, "Economic Growth": 2.5},
    {"Name": "Donald Trump", "Start": 2017, "End": 2021, "Social Liberalism": 50, "Fiscal Conservatism": 85, "Economic Growth": 2.2},
    {"Name": "Joe Biden", "Start": 2021, "End": None, "Social Liberalism": 80, "Fiscal Conservatism": 55, "Economic Growth": None}
]

# Convert data to DataFrames
japan_pm_df = pd.DataFrame(japan_pm_data).dropna(subset=["Economic Growth"])
us_presidents_df = pd.DataFrame(us_presidents_data).dropna(subset=["Economic Growth"])

# Plotting
plt.figure(figsize=(12, 8))

# Japanese Prime Ministers
for _, row in japan_pm_df.iterrows():
    # Draw a dot for each position
    plt.plot(row["Fiscal Conservatism"], row["Social Liberalism"], marker='o', color=japanese_color, alpha=0.7)
    
    # Draw line based on economic growth (right for positive, left for negative)
    end_x = row["Fiscal Conservatism"] + row["Economic Growth"] * 5
    plt.plot(
        [row["Fiscal Conservatism"], end_x],
        [row["Social Liberalism"], row["Social Liberalism"]],
        color=japanese_color, alpha=0.7, linewidth=2
    )
    
    # Add name and years as text below the dot
    plt.text(row["Fiscal Conservatism"], row["Social Liberalism"] - 2, 
             f"{row['Name']} ({row['Start']}-{row['End']})", 
             fontsize=8, color=japanese_color, ha="right")
    
    # Add label for economic growth along the line
    plt.text(end_x, row["Social Liberalism"], f"{row['Economic Growth']}%", 
             fontsize=8, color=japanese_color, va="center", ha="right" if row["Economic Growth"] < 0 else "left")

# American Presidents
for _, row in us_presidents_df.iterrows():
    # Draw a dot for each position
    plt.plot(row["Fiscal Conservatism"], row["Social Liberalism"], marker='o', color=usa_color, alpha=0.7)
    
    # Draw line based on economic growth (right for positive, left for negative)
    end_x = row["Fiscal Conservatism"] + row["Economic Growth"] * 10
    plt.plot(
        [row["Fiscal Conservatism"], end_x],
        [row["Social Liberalism"], row["Social Liberalism"]],
        color=usa_color, alpha=0.7, linewidth=2
    )
    
    plt.text(row["Fiscal Conservatism"], row["Social Liberalism"] + 2, 
             f"{row['Name']} ({row['Start']})", 
             fontsize=8, color=usa_color, ha="left")
    
    # Add label for economic growth along the line
    plt.text(end_x, row["Social Liberalism"], f"{row['Economic Growth']}%", 
             fontsize=8, color=usa_color, va="center", ha="right" if row["Economic Growth"] < 0 else "left")

# Labels and title
plt.xlabel("Fiscal Conservatism (0-100)")
plt.ylabel("Social Liberalism (0-100)")
plt.title("Matrix Chart of Japanese Prime Ministers and American Presidents with Economic Growth Indicators")
plt.grid(True)
plt.show()
