#!/usr/bin/env python3
import sqlite3
import csv
import os

def create_table(conn):
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS insight_search (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_source TEXT,
        modifier_type TEXT,
        modifier TEXT,
        suggestion TEXT,
        language TEXT,
        region TEXT,
        keyword TEXT,
        search_volume INTEGER,
        cost_per_click REAL
    )
    ''')
    
    conn.commit()

def import_csv_to_db(conn, csv_file):
    cursor = conn.cursor()
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        
        for row in csv_reader:
            # 处理搜索量和CPC的空值
            search_volume = None
            if 'Search Volume' in row and row['Search Volume']:
                try:
                    search_volume = int(row['Search Volume'])
                except ValueError:
                    search_volume = None
            
            cpc = None
            if 'Cost Per Click' in row and row['Cost Per Click']:
                try:
                    cpc = float(row['Cost Per Click'])
                except ValueError:
                    cpc = None
            
            # 获取region，如果不存在则为None
            region = row.get('Region', None)
            
            cursor.execute('''
            INSERT INTO insight_search (
                file_source, modifier_type, modifier, suggestion, 
                language, region, keyword, search_volume, cost_per_click
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                os.path.basename(csv_file),
                row.get('Modifier Type'),
                row.get('Modifier'),
                row.get('Suggestion'),
                row.get('Language'),
                region,
                row.get('Keyword'),
                search_volume,
                cpc
            ))
    
    conn.commit()

def main():
    # 连接到数据库
    conn = sqlite3.connect('tribit.db')
    
    try:
        # 创建表
        create_table(conn)
        print("数据表创建成功！")
        
        # CSV文件列表
        csv_files = [
            'insight_search01.csv',
            'insight_search02.csv',
            'insight_search03.csv',
            'insight_search04.csv',
            'insight_search05.csv'
        ]
        
        # 导入每个CSV文件
        for csv_file in csv_files:
            if os.path.exists(csv_file):
                print(f"正在导入 {csv_file}...")
                import_csv_to_db(conn, csv_file)
                print(f"{csv_file} 导入成功！")
            else:
                print(f"警告：{csv_file} 文件不存在")
        
        # 显示导入的记录总数
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM insight_search")
        total_records = cursor.fetchone()[0]
        print(f"\n总共导入了 {total_records} 条记录")
        
        # 显示每个文件的记录数
        print("\n各文件导入记录数：")
        cursor.execute('''
        SELECT file_source, COUNT(*) as count 
        FROM insight_search 
        GROUP BY file_source
        ''')
        for row in cursor.fetchall():
            print(f"{row[0]}: {row[1]} 条记录")
        
    except Exception as e:
        print(f"发生错误：{e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()